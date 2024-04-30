import { GameState } from "../../../domain/GameState";
import { PLAYER_EK_SCORE, PLAYER_HIT_SCORE } from "../utils/Constants";
import { Action } from "./Action";

export interface PlayerAttackActionParams {
  playerId: string;
  enemyId: string;
}

export class PlayerAttackAction implements Action<PlayerAttackActionParams, void> {

  constructor(
    private readonly gameState: GameState
  ) { }

  public execute(params: PlayerAttackActionParams): void {
    if (params.playerId === params.enemyId) return;

    const player = this.gameState.players[params.playerId];
    const enemy = this.gameState.players[params.enemyId];

    if (!player || !enemy) return;
    if (!player.canAttack() || enemy.isDead()) return;

    if (player.isInAttackRange(enemy.getPosition())) {
      player.setAttackMode();
      if (player.canHit(enemy.getArmorClass())) {
        const damage = player.getDamage();
        enemy.hurt(damage);
        player.increaseScore(PLAYER_HIT_SCORE);
        if (enemy.isDead()) {
          player.increaseScore(PLAYER_EK_SCORE);
        }
      }
    }
    else {
      player.setTargetPositionWithEnemyTarget(enemy.getPosition());
    }

  }
}