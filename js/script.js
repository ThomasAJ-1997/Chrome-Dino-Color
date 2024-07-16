// VARIABLES
const game_world_width = 100;
const game_world_height = 30;

// DATA ATTRIBUTES
const game_world_size = document.querySelector("[data-game]");

setGameWorldSize();
window.addEventListener("resize", setGameWorldSize);

// UPDATE LOOP: GAME ITEMS
let latestTime;

function updateGameItems(time) {
  if (latestTime == null) {
    latestTime = time;
    window.requestAnimationFrame(updateGameItems);
    return;
  }
  const gameFrames = time - latestTime;
  console.log(gameFrames);

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
