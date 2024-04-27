import { GameState } from "../../../domain/GameState";

export class GameStateEvent {
  constructor(private readonly gameState: GameState) { }

  execute() {
    return this.gameState;
  }
}