import { Socket } from "socket.io-client";
import { GAME_STATE_MESSAGE } from "../../../domain/Messages";
import { GameState } from "../../../domain/GameState";
import { PlayerEntity } from "../../entities/PlayerEntity";
import { Scene } from "phaser";
import { SocketManager } from "../SocketManager";
import { GameHud } from "../../huds/GameHud";

export class GameStateHandler {
  constructor(
    private readonly socketManager: SocketManager,
    private readonly scene: Scene,
    private readonly players: Record<string, PlayerEntity>,
    private readonly gameHud: GameHud
  ) { }

  public execute(gameState: GameState) {
    this.gameHud.setGameState(gameState);
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
            if (this.players[key]) {
              this.players[key].destroy();
            }
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