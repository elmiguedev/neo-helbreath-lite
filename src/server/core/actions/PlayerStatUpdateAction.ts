import { GameState } from "../../../domain/GameState";
import { PlayerState, PlayerStats } from "../../../domain/Player";
import { Action } from "./Action";

export interface PlayerStatUpdateActionProps {
  playerId: string;
  stats: PlayerStats;
}

export class PlayerStatUpdateAction implements Action<PlayerStatUpdateActionProps, void> {
  constructor(
    private readonly gameState: GameState
  ) { }

  public execute(params: PlayerStatUpdateActionProps): void {
    const player = this.gameState.players[params.playerId];
    if (!player) return;
    if (!player.canUpdateStats()) return;
    if (this.getTotalPoints(params.stats) === 0) return;
    if (this.getTotalPoints(params.stats) > player.getAvailablePoints()) return;

    player.updateStats(params.stats);
  }

  private getTotalPoints(stats: PlayerStats) {
    return Object.values(stats).reduce((a, b) => a + b, 0);
  }
}