import { GameState } from "../../../domain/GameState";
import { Action } from "./Action";

export class PlayerCancelAction implements Action<string, void> {
  constructor(
    private readonly gameState: GameState
  ) { }
  public execute(playerId: string): void {
    const player = this.gameState.players[playerId];
    if (player && !player.isDead()) {
      player.setState("idle");
      player.setTargetPosition(undefined);
    }
  }
}