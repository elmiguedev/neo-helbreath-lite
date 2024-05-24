import { Game } from "../Game";

export interface Entity {
  update(game: Game): void;
}