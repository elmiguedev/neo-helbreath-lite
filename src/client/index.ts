import { Game } from "phaser";
import { GameScene } from "./scenes/GameScene";
import { BootloaderScene } from "./scenes/BootloaderScene";
import { StartScene } from "./scenes/StartScene";
import { GameHud } from "./huds/GameHud";

export default new Game({
  type: Phaser.AUTO,
  parent: "game",
  backgroundColor: "#000000",
  scale: {
    width: window.innerWidth,
    height: window.innerHeight
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
})