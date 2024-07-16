// VARIABLES
const game_world_width = 100;
const game_world_height = 30;

// DATA ATTRIBUTES
const game_world_size = document.querySelector("[data-game]");
const ground_elements = document.querySelectorAll("[data-ground]");

setGameWorldSize();
window.addEventListener("resize", setGameWorldSize);

groundRandomGenerator();

// UPDATE LOOP: GAME ITEMS
let latestTime;

function updateGameItems(time) {
  if (latestTime == null) {
    latestTime = time;
    window.requestAnimationFrame(updateGameItems);
    return;
  }
  const gameFrames = time - latestTime;
  updateGroundPosition(gameFrames, 1);

  // console.log(gameFrames);

  latestTime = time;
  window.requestAnimationFrame(updateGameItems);
}

window.requestAnimationFrame(updateGameItems);

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
