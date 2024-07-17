// VARIABLES
const game_world_width = 100;
const game_world_height = 30;
const game_world_speed = 0.00001;

// DATA ATTRIBUTES

// Game attributes
const game_world_size = document.querySelector("[data-game]");
const ground_elements = document.querySelectorAll("[data-ground]");
const score_elements = document.querySelector("[data-score]");
const menu_elements = document.querySelector("[data-menu]");

//////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////////

// CHROME DINO MAIN CODE

setGameWorldSize();
window.addEventListener("resize", setGameWorldSize);
document.addEventListener("keydown", startMenu, { once: true });

// UPDATE LOOP: GAME ITEMS
let latestTime;
let speedScale;
let score;

function updateGameItems(time) {
  if (latestTime == null) {
    latestTime = time;
    window.requestAnimationFrame(updateGameItems);
    return;
  }
  const gameFrames = time - latestTime;

  updateGroundPosition(gameFrames, speedScale);
  updateDinosaur(gameFrames, speedScale);
  updateCactus(gameFrames, speedScale);
  increaseGameSpeed(gameFrames);
  scoreCounter(gameFrames);
  if (gameOver()) return gameLost();
  // console.log(gameFrames);

  latestTime = time;
  window.requestAnimationFrame(updateGameItems);
}

function increaseGameSpeed(gameFrames) {
  speedScale = speedScale + gameFrames * game_world_speed;
}

function scoreCounter(gameFrames) {
  score = score + gameFrames * 0.01;
  score_elements.textContent = Math.floor(score);
}

///////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////

// START MENU SYSTEM
function startMenu() {
  latestTime = null;
  speedScale = 1;
  score = 0;
  groundRandomGenerator();
  setupDinosaur();
  setupCactus();
  menu_elements.classList.add("hide-graphics");
  window.requestAnimationFrame(updateGameItems);
}

///////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////

// SET GAME WORLD SIZE BY BROWSER
function setGameWorldSize() {
  let worldScale;
  if (
    window.innerWidth / window.innerHeight <
    game_world_width / game_world_height
  ) {
    worldScale = window.innerWidth / game_world_width;
  } else {
    worldScale = window.innerHeight / game_world_height;
  }

  game_world_size.style.width = `${game_world_width * worldScale}px`;
  game_world_size.style.height = `${game_world_height * worldScale}px`;
}

///////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////

// GROUND ELEMENT

const frame = 0.05;

function updateGroundPosition(gameFrames, speedFrames) {
  ground_elements.forEach((ground) => {
    updateProperty(ground, "--left", gameFrames * speedFrames * frame * -1);

    // Fix ground bug: ground runs out. (Ground: Infinite Loop)
    if (getProperty(ground, "--left") <= -300) {
      updateProperty(ground, "--left", 600);
    }
  });
}

function groundRandomGenerator() {
  setProperty(ground_elements[0], "--left", 0);
  setProperty(ground_elements[1], "--left", 300);
}

///////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////

// DINOSAUR CONTROLS

// Dinosaur attributes
const dinosaur_elements = document.querySelector("[data-dinosaur]");
const dinosaur_jump = 0.45;
const dinosaur_frames = 2; // Dinosaur animation frames: imgs
const dinosaur_frame_time = 100; // Animation changes 10 times every second
const dinosaur_gravity_physics = 0.0015;

let dinosaurJumpAnimation;
let dinosaurFrame;
let frameTime;
let dinosaurVelocity;

function setupDinosaur() {
  dinosaurJumpAnimation = false;
  dinosaurFrame = 0;
  frameTime = 0;
  dinosaurVelocity = 0;
  setProperty(dinosaur_elements, "--bottom", 0);
  document.removeEventListener("keydown", dinosaurJumpCommand);
  document.addEventListener("keydown", dinosaurJumpCommand);
}

function updateDinosaur(gameFrames, speedScale) {
  dinosaurRun(gameFrames, speedScale);
  dinosaurJump(gameFrames);
}

function dinosaurRun(gameFrames, speedScale) {
  if (dinosaurJumpAnimation) {
    dinosaur_elements.src =
      "/Users/thomasjones97/Documents/Developer/repo/Chrome Dino/Chrome-Dino-Color/img/dino-stationary-color.png";
    return;
  }

  if (frameTime >= dinosaur_frame_time) {
    dinosaurFrame = (dinosaurFrame + 1) % dinosaur_frames;

    dinosaur_elements.src = `/Users/thomasjones97/Documents/Developer/repo/Chrome Dino/Chrome-Dino-Color/img/dino-run-color-${dinosaurFrame}.png`;

    frameTime = -dinosaur_frame_time;
  }
  frameTime += gameFrames * speedScale;
}

function dinosaurJump(gameFrames) {
  if (!dinosaurJumpAnimation) return;

  updateProperty(dinosaur_elements, "--bottom", dinosaurVelocity * gameFrames);
  if (getProperty(dinosaur_elements, "--bottom") <= 0) {
    setProperty(dinosaur_elements, "--bottom", 0);
    dinosaurJumpAnimation = false;
  }
  dinosaurVelocity -= dinosaur_gravity_physics * gameFrames;
}

function dinosaurJumpCommand(e) {
  if (e.code !== "Space" || dinosaurJumpAnimation) return;
  dinosaurVelocity = dinosaur_jump;
  dinosaurJumpAnimation = true;
  audioJumpSound();
}

function dinosaurHitBox() {
  return dinosaur_elements.getBoundingClientRect();
}

///////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////

// AUDIO SOUNDS

let play = document.getElementById("dinosaur");
function audioJumpSound() {
  let audio = new Audio(
    "/Users/thomasjones97/Documents/Developer/repo/Chrome Dino/Chrome-Dino-Color/audio/dinosaur-jump.mp3"
  );
  audio.play();
}
play.addEventListener("keydown", audioJumpSound);

///////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////

// CACTUS
const cactus_speed = 0.05;
const cactus_interval_minimum = 500; // Random Cactus generator when spawned in
const cactus_interval_maximum = 2000; // min half a second and max 2 seconds

let cactusTime;

function setupCactus() {
  cactusTime = cactus_interval_minimum;
  document.querySelectorAll("[data-cactus]").forEach((cactus) => {
    cactus.remove(); // Remove cactus when game is over, and start again.
  });
}

function updateCactus(gameFrames, speedScale) {
  document.querySelectorAll("[data-cactus]").forEach((cactus) => {
    updateProperty(
      cactus,
      "--left",
      gameFrames * speedScale * cactus_speed * -1
    );
    // Exact same speed as ground and dinosaur character.
    if (getProperty(cactus, "--left") <= -100) {
      cactus.remove();
    } // cactus off screen: remove them.
  });

  if (cactusTime <= 0) {
    spawnCactus();
    cactusTime =
      randomNumberBetween(cactus_interval_minimum, cactus_interval_maximum) /
      speedScale;
  }
  cactusTime -= gameFrames;
}

function spawnCactus() {
  const cactus = document.createElement("img");
  cactus.dataset.cactus = true;
  cactus.src =
    "/Users/thomasjones97/Documents/Developer/repo/Chrome Dino/Chrome-Dino-Color/img/cactus-color.png";
  cactus.classList.add("cactus");
  setProperty(cactus, "--left", 100);
  game_world_size.append(cactus);
}

function randomNumberBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function cactusHitBox() {
  return [...document.querySelectorAll("[data-cactus]")].map((cactus) => {
    return cactus.getBoundingClientRect(); // Hit box of Cactus image.
  });
}

///////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////

// GAME OVER FEATURE
function gameOver() {
  const dinosaur_hitbox = dinosaurHitBox();
  return cactusHitBox().some((hit) => collision(hit, dinosaur_hitbox));
}

function collision(hit1, hit2) {
  return (
    hit1.left < hit2.right &&
    hit1.top < hit2.bottom &&
    hit1.right > hit2.left &&
    hit1.bottom > hit2.top
  );
}

function gameLost() {
  dinosaurLose();
  setTimeout(() => {
    document.addEventListener("keydown", startMenu, { once: true });
    menu_elements.classList.remove("hide-graphics");
  }, 100);
}

function dinosaurLose() {
  dinosaur_elements.src =
    "/Users/thomasjones97/Documents/Developer/repo/Chrome Dino/Chrome-Dino-Color/img/dino-lose-color.png";
  audioGameOverSound();
}

function audioGameOverSound() {
  let audio = new Audio(
    "/Users/thomasjones97/Documents/Developer/repo/Chrome Dino/Chrome-Dino-Color/audio/dinosaur-gameOver.mp3"
  );
  audio.play();
}
play.addEventListener(audioGameOverSound);

///////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////

// HELPER FUNCTIONS

function getProperty(elem, prop) {
  // Get CSS Variables to utilise in JavaScript
  // If no CSS variable number: make it 0.
  return parseFloat(getComputedStyle(elem).getPropertyValue(prop)) || 0;
}

function setProperty(elem, prop, value) {
  elem.style.setProperty(prop, value);
}

// getting the current value: adding an increment to the getProperty() function, and then setting the value.
function updateProperty(elem, prop, inc) {
  setProperty(elem, prop, getProperty(elem, prop) + inc);
}

///////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////
