import { Scene } from "phaser";
import { SocketManager } from "../sockets/SocketManager";
import { Player } from "../../domain/Player";
import { PlayerEntity } from "../entities/PlayerEntity";
import { GameState } from "../../domain/GameState";

export class GameScene extends Scene {
  private socketManager: SocketManager;
  private players: Record<string, PlayerEntity> = {};

  constructor() {
    super("GameScene");
  }

  create() {
    this.createSocketManager();
    this.createBackground();
    this.createInput();
  }

  update() {
    this.updatePlayers();
  }

  createSocketManager() {
    this.players = {}
    this.socketManager = new SocketManager(this, this.players);
  }

  private createBackground() {
    this.cameras.main.setBackgroundColor(0xffffff)
    this.add.grid(0, 0, 2048, 2048, 32, 32, 0xffffff, 1, 0xcccccc).setDepth(-3000);
  }

  private createInput() {
    this.input.on("pointerdown", (pointer, gameObjects: any[]) => {
      if (gameObjects.length > 0) {
        if (gameObjects.length === 1) {
          const playerEntity: PlayerEntity = gameObjects[0];
          this.socketManager.notifyPlayerAttack(playerEntity.getId());
        }
      } else {
        this.socketManager.notifyPlayerMove({
          x: pointer.worldX,
          y: pointer.worldY
        });
      }
    });
  }

  private updatePlayers() {
    for (const id in this.players) {
      if (this.players[id])
        this.players[id].update();
    }
  }

}