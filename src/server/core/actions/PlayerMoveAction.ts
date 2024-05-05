import { GameState } from "../../../domain/GameState";
import { Position } from "../../../domain/Position";
import { Action } from "./Action";

export interface PlayerMoveActionParams {
  id: string;
  position: Position;
  tickNumber: number;
}
export class PlayerMoveAction implements Action<PlayerMoveActionParams, void> {
  constructor(private readonly gameState: GameState) { }

  public execute(params: PlayerMoveActionParams): void {
    const player = this.gameState.players[params.id];
    if (player && player.playerState.targetPosition !== params.position) {
      player.setInputTickNumber(params.tickNumber);
      player.setTargetPosition(params.position);
    }
  }
}