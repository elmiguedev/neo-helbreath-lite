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
    const step = 16;
    if (!player) return;
    let dx = 0;
    let dy = 0;
    if (input.keys.left === true) {
      dx = -step;
    }
    if (input.keys.right === true) {
      dx = step;
    }
    if (input.keys.up === true) {
      dy = -step;
    }
    if (input.keys.down === true) {
      dy = step;
    }

    if (dx === 0 && dy === 0) return;
    player.setTargetPosition({
      x: player.playerState.position.x + dx,
      y: player.playerState.position.y + dy
    });
  }

}