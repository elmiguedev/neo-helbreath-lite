import { Game } from "phaser";
import { GameScene } from "./scenes/GameScene";
import { BootloaderScene } from "./scenes/BootloaderScene";

export default new Game({
  type: Phaser.AUTO,
  parent: "game",
  backgroundColor: "#000000",
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 600,
    height: 600
  },
  render: {
    pixelArt: true
  },
  scene: [
    BootloaderScene,
    GameScene
  ]
})