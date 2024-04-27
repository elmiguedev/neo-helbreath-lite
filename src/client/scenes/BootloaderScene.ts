import { Scene } from "phaser";

import PlayerPng from "../assets/sprites/player/player.png";
import PlayerJson from "../assets/sprites/player/player.json";

export class BootloaderScene extends Scene {
  constructor() {
    super("BootloaderScene");
  }

  public preload() {
    this.load.aseprite("player", PlayerPng, PlayerJson);
    this.load.once("complete", () => {
      this.scene.start("GameScene");
    })
  }

}