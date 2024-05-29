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
    const player = this.game.getPlayerById(params.playerId);
    const monster = this.game.getMonsterById(params.monsterId);

    if (!player || !monster || player.worldMapId !== monster.worldMapId) return;

    player.attackMonster(monster);
  }
}