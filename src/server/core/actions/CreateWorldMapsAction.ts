import { Game } from "../Game";
import { Action } from "./Action";

import TestMapJson from "../../../client/assets/tilemaps/test/test.json";
import HouseMapJson from "../../../client/assets/tilemaps/house/house.json";
import { TiledMap } from "../entities/worldmap/TiledMap";
import { WorldMap } from "../entities/worldmap/WorldMap";

export class CreateWorldMapsAction implements Action<void, void> {
  constructor(private readonly game: Game) { }

  public execute(): void {
    const testMap = new TiledMap(TestMapJson);
    const houseMap = new TiledMap(HouseMapJson);

    this.game.addWorldMap(new WorldMap({
      id: "test",
      tiled: testMap
    }));

    this.game.addWorldMap(new WorldMap({
      id: "house",
      tiled: houseMap
    }));

  }

}