import { Game } from "../Game";
import { PLAYER_KEY_DISTANCE } from "../utils/Constants";
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
    private readonly game: Game
  ) { }

  public execute(input: PlayerMoveKeysActionProps): void {
    const player = this.game.getPlayerById(input.playerId);
    if (!player) return;
    const dx = input.keys.right ? PLAYER_KEY_DISTANCE : input.keys.left ? -PLAYER_KEY_DISTANCE : 0;
    const dy = input.keys.down ? PLAYER_KEY_DISTANCE : input.keys.up ? -PLAYER_KEY_DISTANCE : 0;
    if (dx === 0 && dy === 0) return;
    player.setTargetPosition({
      x: player.position.x + dx,
      y: player.position.y + dy
    });
  }

}