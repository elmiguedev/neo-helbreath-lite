import { Socket } from "socket.io-client";
import { GAME_STATE_MESSAGE } from "../../../domain/Messages";
import { GameState } from "../../../domain/GameState";
import { PlayerEntity } from "../../entities/PlayerEntity";
import { Scene } from "phaser";
import { SocketManager } from "../SocketManager";

export class GameStateHandler {
  constructor(
    private readonly socketManager: SocketManager,
    private readonly scene: Scene,
    private readonly players: Record<string, PlayerEntity>
  ) { }

  public execute(gameState: GameState) {
    Object.keys(gameState.players).forEach((key) => {
      const player = gameState.players[key];
      if (!this.players[key]) {
        this.players[key] = new PlayerEntity(this.scene, player);
        if (key === this.socketManager.getId()) {
          this.scene.cameras.main.startFollow(this.players[key]);
          this.players[key].onDie = () => {
            this.socketManager.disconnect();
            this.scene.scene.restart();
          }
        } else {
          this.players[key].onDie = () => {
            this.players[key].destroy();
            delete this.players[key];
          }
        }
      } else {
        if (this.players[key])
          this.players[key].setPlayerState(player);
      }
    });
  }

}