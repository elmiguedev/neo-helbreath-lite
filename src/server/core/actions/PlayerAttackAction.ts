import { GameState } from "../../../domain/GameState";
import { PLAYER_ATTACK_DISTANCE, PLAYER_EK_SCORE, PLAYER_HIT_SCORE } from "../utils/Constants";
import { Utils } from "../utils/Utils";
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
    if (player && enemy) {
      const distance = Utils.distanceBetween(player.position, enemy.position);
      if (distance <= PLAYER_ATTACK_DISTANCE) {
        player.state = "attack";
        setTimeout(() => { player.state = "idle" }, 200);
        const hitRoll = Utils.throwDice(1, 20);
        if (hitRoll >= 4) {
          const damage = Utils.throwDice(2, 8);
          enemy.hp -= damage;
          if (enemy.hp > 0) {
            player.score += PLAYER_HIT_SCORE;
            enemy.state = "hurt"
            setTimeout(() => { enemy.state = "idle" }, 200);
          } else {
            player.score += PLAYER_EK_SCORE;
            enemy.state = "dead"
          }
        }

      }
    }
  }

}