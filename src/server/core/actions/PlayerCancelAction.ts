import { Game } from "../Game";
import { Action } from "./Action";

export class PlayerCancelAction implements Action<string, void> {
  constructor(
    private readonly game: Game
  ) { }

  public execute(playerId: string): void {
    const player = this.game.getPlayerById(playerId);
    if (!player) return;
    player.stopMovement();
  }
}