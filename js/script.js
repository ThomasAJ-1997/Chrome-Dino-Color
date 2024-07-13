// VARIABLES
const game_world_width = 100;
const game_world_height = 30;

// DATA ATTRIBUTES
const game_world_size = document.querySelector("[data-game]");

setGameWorldSize();
window.addEventListener("resize", setGameWorldSize);

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
