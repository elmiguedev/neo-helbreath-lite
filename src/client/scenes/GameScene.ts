import { Scene } from "phaser";
import { SocketManager } from "../sockets/SocketManager";
import { PlayerEntity } from "../entities/PlayerEntity";
import { GameHud } from "../huds/GameHud";

export class GameScene extends Scene {
  private socketManager: SocketManager;
  private players: Record<string, PlayerEntity> = {};
  private playerName: string;
  private gameHud: GameHud;

  constructor() {
    super("GameScene");
  }

  init(data: any) {
    this.playerName = data.name;
  }

  create() {
    this.createGameHud();
    this.createSocketManager();
    this.createBackground();
    this.createMusic();
    this.createInput();
  }

  update() {
    this.updatePlayers();
  }

  createSocketManager() {
    this.players = {}
    this.socketManager = new SocketManager(
      this,
      this.players,
      this.playerName,
      this.gameHud
    );
  }

  private createBackground() {
    this.cameras.main.setBackgroundColor(0xffffff)
    this.add.grid(0, 0, 2048, 2048, 32, 32, 0xffffff, 1, 0xdddddd).setDepth(-3000);
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

  private createMusic() {
    this.sound.stopAll();
    this.sound.play("game", {
      loop: true,
      volume: 0.2
    });
  }

  private createGameHud() {
    this.scene.run("GameHud");
    this.gameHud = this.scene.get("GameHud") as GameHud;
  }

}