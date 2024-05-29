import { WorldMap } from "./worldmap/WorldMap";

export interface Entity {
  update(worldMap: WorldMap): void;
}