import { Game } from "../Game";
import { Action } from "./Action";

export interface RemovePlayerActionParams {
  id: string;
}

export class RemovePlayerAction implements Action<RemovePlayerActionParams, void> {
  constructor(private readonly game: Game) { }

  public execute(input: RemovePlayerActionParams): void {
    this.game.removePlayer(input.id);
  }
}