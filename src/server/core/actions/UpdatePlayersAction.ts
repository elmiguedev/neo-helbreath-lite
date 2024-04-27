import { GameState } from "../../../domain/GameState";
import { PLAYER_MAX_SPEED } from "../utils/Constants";
import { Utils } from "../utils/Utils";
import { Action } from "./Action";

export class UpdatePlayersAction implements Action<void, void> {
  constructor(
    private readonly gameState: GameState
  ) { }

  public execute(): void {
    Object.values(this.gameState.players).forEach((player) => {
      if (player.state === "dead") return;
      if (player.state === "attack") return;
      if (player.state === "hurt") return;
      if (player.targetPosition) {
        player.state = "walk";
        player.position = Utils.constantLerpPosition(
          player.position.x,
          player.position.y,
          player.targetPosition.x,
          player.targetPosition.y,
          PLAYER_MAX_SPEED
        );
        const targetDistance = Utils.distanceBetweenPoints(
          player.position.x,
          player.position.y,
          player.targetPosition.x,
          player.targetPosition.y
        );
        if (targetDistance < PLAYER_MAX_SPEED) {
          player.position = player.targetPosition
          player.targetPosition = undefined;
        }
        if (player.position.y <= -1024) player.position.y = -1024;
        if (player.position.x <= -1024) player.position.x = -1024;
        if (player.position.y >= 1024) player.position.y = 1024;
        if (player.position.x >= 1024) player.position.x = 1024;

      } else {
        player.state = "idle";
      }
    })
  }
}