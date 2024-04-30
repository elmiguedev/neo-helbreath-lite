import { GameState } from "../../../domain/GameState";
import { Position } from "../../../domain/Position";
import { Action } from "./Action";

export interface PlayerMoveActionParams {
  id: string;
  position: Position;
}
export class PlayerMoveAction implements Action<PlayerMoveActionParams, void> {
  constructor(private readonly gameState: GameState) { }

  public execute(params: PlayerMoveActionParams): void {
    const player = this.gameState.players[params.id];
    if (player) {
      player.setTargetPosition(params.position);
    }
  }
}