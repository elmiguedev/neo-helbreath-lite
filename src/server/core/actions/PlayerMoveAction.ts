import { Game } from "../Game";
import { Position } from "../entities/Poisition";
import { Action } from "./Action";

export interface PlayerMoveActionParams {
  id: string;
  position: Position;
}
export class PlayerMoveAction implements Action<PlayerMoveActionParams, void> {
  constructor(private readonly game: Game) { }

  public execute(params: PlayerMoveActionParams): void {
    const player = this.game.getPlayerById(params.id);
    console.log("EL PLAYER A MOVERSE", player, params);
    if (!player) return;
    player.setTargetPosition(params.position);
  }
}