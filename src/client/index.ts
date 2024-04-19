import { Game } from "phaser";
import { StartScene } from "./scenes/StartScene";

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
  scene: [StartScene]
})