import { GameState } from "../../../domain/GameState";
import { PlayerEntity } from "../entities/PlayerEntity";
import { WORLD_RADIUS } from "../utils/Constants";
import { Action } from "./Action";

export class UpdatePlayersAction implements Action<void, void> {
  constructor(
    private readonly gameState: GameState
  ) { }

  public execute(): void {
    Object.values(this.gameState.players).forEach((player) => {
      if (!player.canMove()) return;
      player.setState("walk");
      player.updatePosition();
      player.updateHp();
      this.validateWorldBounds(player);

      if (!player.canMove()) {
        player.setState("idle");
      }
    })
  }

  private validateWorldBounds(player: PlayerEntity) {
    if (player.getPosition().y <= -WORLD_RADIUS)
      player.setPosition({ x: player.getPosition().x, y: -WORLD_RADIUS });
    if (player.getPosition().x <= -WORLD_RADIUS)
      player.setPosition({ x: -WORLD_RADIUS, y: player.getPosition().y });
    if (player.getPosition().y >= WORLD_RADIUS)
      player.setPosition({ x: player.getPosition().x, y: WORLD_RADIUS });
    if (player.getPosition().x >= WORLD_RADIUS)
      player.setPosition({ x: WORLD_RADIUS, y: player.getPosition().y });
  }
}
