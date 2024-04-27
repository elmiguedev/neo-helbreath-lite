import { Socket } from "socket.io-client";
import { GAME_STATE_MESSAGE } from "../../../domain/Messages";
import { GameState } from "../../../domain/GameState";
import { PlayerEntity } from "../../entities/PlayerEntity";
import { Scene } from "phaser";

export class GameStateHandler {
  constructor(
    private readonly id: string,
    private readonly scene: Scene,
    private readonly players: Record<string, PlayerEntity>
  ) { }

  public execute(gameState: GameState) {
    Object.keys(gameState.players).forEach((key) => {
      const player = gameState.players[key];
      if (!this.players[key]) {
        this.players[key] = new PlayerEntity(this.scene, player);
        if (key === this.id) {
          this.scene.cameras.main.startFollow(this.players[key]);
        }
      } else {
        this.players[key].setPlayerState(player);
      }
    });
  }

}