import { Game } from "../Game";
import { Action } from "./Action";

export interface PlayerAttackActionParams {
  playerId: string;
  enemyId: string;
}

export class PlayerAttackAction implements Action<PlayerAttackActionParams, void> {

  constructor(
    private readonly game: Game
  ) { }

  public execute(params: PlayerAttackActionParams): void {
    if (params.playerId === params.enemyId) return;

    const player = this.game.players[params.playerId];
    const enemy = this.game.players[params.enemyId];

    if (!player || !enemy) return;

    player.attackPlayer(enemy);
  }
}