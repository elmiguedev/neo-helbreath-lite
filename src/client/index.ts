import { Game } from "phaser";
import { GameScene } from "./scenes/GameScene";
import { BootloaderScene } from "./scenes/BootloaderScene";
import { StartScene } from "./scenes/StartScene";
import { GameHud } from "./huds/GameHud";

const game = new Game({
  type: Phaser.AUTO,
  parent: "game",
  backgroundColor: "#000000",
  scale: {
    width: window.innerWidth,
    height: window.innerHeight,
    mode: Phaser.Scale.FIT,
  },
  render: {
    pixelArt: true
  },
  dom: {
    createContainer: true
  },
  scene: [
    BootloaderScene,
    StartScene,
    GameScene,
    GameHud
  ]
});

// const resizeGame = () => {
//   const canvas = document.querySelector('canvas');
//   if (canvas) {

//     const windowWidth = window.innerWidth;
//     const windowHeight = window.innerHeight;

//     // const windowRatio = windowWidth / windowHeight;
//     // const gameRatio: number = Number(game.config.width) / Number(game.config.height);

//     // if (windowRatio < gameRatio) {
//     //   canvas.style.width = windowWidth + 'px';
//     //   canvas.style.height = (windowWidth / gameRatio) + 'px';
//     // } else {
//     //   canvas.style.width = (windowHeight * gameRatio) + 'px';
//     //   canvas.style.height = windowHeight + 'px';
//     // }

//     canvas.style.width = windowWidth + 'px';
//     canvas.style.height = windowHeight + 'px';
//   }
// }

// window.addEventListener('resize', resizeGame);
// resizeGame();

export default game;