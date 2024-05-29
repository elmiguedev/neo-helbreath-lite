import { Game } from "../Game";
import { PlayerAttributes } from "../entities/player/PlayerAttributes";
import { Action } from "./Action";

export interface PlayerStatUpdateActionProps {
  playerId: string;
  attributes: PlayerAttributes;
}

export class PlayerStatUpdateAction implements Action<PlayerStatUpdateActionProps, void> {
  constructor(
    private readonly game: Game
  ) { }

  public execute(params: PlayerStatUpdateActionProps): void {
    const player = this.game.getPlayerById(params.playerId);
    if (!player) return;
    player.updateAttributes(params.attributes);
  }


}