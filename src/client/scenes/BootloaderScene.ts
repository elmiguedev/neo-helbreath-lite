import { Scene } from "phaser";

import PlayerPng from "../assets/sprites/player/player.png";
import PlayerJson from "../assets/sprites/player/player.json";
import WalkWav from "../assets/sounds/walk.wav";
import HurtWav from "../assets/sounds/hurt.wav";
import GameMp3 from "../assets/sounds/game.mp3";

export class BootloaderScene extends Scene {
  constructor() {
    super("BootloaderScene");
  }

  public preload() {
    this.load.aseprite("player", PlayerPng, PlayerJson);
    this.load.audio("walk", WalkWav);
    this.load.audio("hurt", HurtWav);
    this.load.audio("game", GameMp3);
    this.load.once("complete", () => {
      this.scene.start("StartScene");
    })
  }

}