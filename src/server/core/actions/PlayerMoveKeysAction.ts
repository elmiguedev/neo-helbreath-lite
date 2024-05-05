import { GameState } from "../../../domain/GameState";
import { Action } from "./Action";

export interface PlayerMoveKeysActionProps {
  playerId: string;
  keys: {
    left: boolean;
    right: boolean;
    up: boolean;
    down: boolean;
  }
}

export class PlayerMoveKeysAction implements Action<PlayerMoveKeysActionProps, void> {
  constructor(
    private readonly gameState: GameState
  ) { }

  public execute(input: PlayerMoveKeysActionProps): void {
    const player = this.gameState.players[input.playerId];
    if (!player) return;
    const dx = input.keys.right ? 32 : input.keys.left ? -32 : 0;
    const dy = input.keys.down ? 32 : input.keys.up ? -32 : 0;
    if (dx === 0 && dy === 0) return;
    player.setTargetPosition({
      x: player.playerState.position.x + dx,
      y: player.playerState.position.y + dy
    });
  }

}