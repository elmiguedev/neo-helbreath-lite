import { Scene } from "phaser";

import PlayerPng from "../assets/sprites/player/player.png?url";
import PlayerJson from "../assets/sprites/player/player.json";
import StatButtonPng from "../assets/sprites/ui/stat_button.png?url";
import TestMapJson from "../assets/tilemaps/test/test.json";
import HouseMapJson from "../assets/tilemaps/house/house.json";
import TerrainPng from "../assets/tilesets/terrain/terrain.png?url";


export class BootloaderScene extends Scene {
  constructor() {
    super("BootloaderScene");
  }

  public preload() {

    // maps resources
    this.load.tilemapTiledJSON("test", TestMapJson);
    this.load.tilemapTiledJSON("house", HouseMapJson);
    this.load.image("terrain", TerrainPng);

    this.load.image("stat_button", StatButtonPng);
    this.load.aseprite("player", PlayerPng, PlayerJson);

    this.load.on("complete", () => {
      this.scene.start("StartScene");
    })
  }

}