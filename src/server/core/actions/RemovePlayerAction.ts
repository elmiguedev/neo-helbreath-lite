import { GameState } from "../../../domain/GameState";
import { Action } from "./Action";

export interface RemovePlayerActionParams {
  id: string;
}

export class RemovePlayerAction implements Action<RemovePlayerActionParams, void> {
  constructor(private readonly gameState: GameState) { }

  public execute(input: RemovePlayerActionParams): void {
    delete this.gameState.players[input.id];
  }
}