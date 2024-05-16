import { Game } from "../Game";
import { Action } from "./Action";

export interface PlayerAttackMonsterActionParams {
  playerId: string;
  monsterId: string;
}

export class PlayerAttackMonsterAction implements Action<PlayerAttackMonsterActionParams, void> {

  constructor(
    private readonly game: Game
  ) { }

  public execute(params: PlayerAttackMonsterActionParams): void {
    const player = this.game.players[params.playerId];
    const monster = this.game.monsters[params.monsterId];

    if (!player || !monster) return;

    player.attackMonster(monster);
  }
}