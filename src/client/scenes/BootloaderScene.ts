import { Scene } from "phaser";

import PlayerPng from "../assets/sprites/player/player.png?url";
import PlayerJson from "../assets/sprites/player/player.json";
import HurtOgg from "../assets/sounds/hurt.ogg";
import GameMp3 from "../assets/sounds/game.mp3?url";
import StatButtonPng from "../assets/sprites/ui/stat_button.png?url";
import ChobiPng from "../assets/sprites/monsters/chobi/chobi.png";
import ChobiJson from "../assets/sprites/monsters/chobi/chobi.json";

export class BootloaderScene extends Scene {
  constructor() {
    super("BootloaderScene");
  }

  public preload() {
    this.load.image("stat_button", StatButtonPng);
    this.load.aseprite("player", PlayerPng, PlayerJson);
    this.load.audio("hurt", HurtOgg);
    this.load.audio("game", GameMp3);

    this.load.aseprite("chobi", ChobiPng, ChobiJson);

    this.load.on("complete", () => {
      this.scene.start("StartScene");
    })
  }

}