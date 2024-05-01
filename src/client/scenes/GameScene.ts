import { Scene } from "phaser";
import { SocketManager } from "../sockets/SocketManager";
import { PlayerEntity } from "../entities/PlayerEntity";
import { GameHud } from "../huds/GameHud";

export class GameScene extends Scene {
  private socketManager: SocketManager;
  private players: Record<string, PlayerEntity> = {};
  private playerName: string;
  private gameHud: GameHud;

  private mouseObjects: any[];

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
    // this.checkInput();
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
    this.add.grid(0, 0, 2048, 2048, 32, 32, 0xffffff, 1, 0xeeeeee).setDepth(-3000);
  }

  private createInput() {
    this.input.mouse?.disableContextMenu();
    this.input.on("pointerdown", (pointer, gameObjects: any[]) => {
      if (gameObjects.length > 0) {
        if (gameObjects.length === 1) {
          const playerEntity: PlayerEntity = gameObjects[0];
          this.socketManager.notifyPlayerAttack(playerEntity.getId());
        }
      } else {
        if (pointer.button === 0) {
          this.socketManager.notifyPlayerMove({
            x: pointer.worldX,
            y: pointer.worldY
          });
        }
        if (pointer.button === 2) {
          this.socketManager.notifyPlayerCancel();
        }

      }
    });

    this.input.on("pointermove", (pointer, gameObjects: any[]) => {
      if (pointer.isDown) {
        if (gameObjects.length > 0) {
          if (gameObjects.length === 1) {
            const playerEntity: PlayerEntity = gameObjects[0];
            this.socketManager.notifyPlayerAttack(playerEntity.getId());
          }
        } else {
          if (pointer.button === 0) {
            this.socketManager.notifyPlayerMove({
              x: pointer.worldX,
              y: pointer.worldY
            });
          }
        }
      }
    });

  }
  // private checkInput() {
  //   if (this.input.mousePointer.isDown) {
  //     this.gameHud.setTestText(`TRUE (${this.mouseObjects})`)
  //     if (this.mouseObjects.length > 0) {
  //       if (this.mouseObjects.length === 1) {
  //         const playerEntity: PlayerEntity = this.mouseObjects[0];
  //         this.socketManager.notifyPlayerAttack(playerEntity.getId());
  //       }
  //     } else {

  //       this.socketManager.notifyPlayerMove({
  //         x: this.input.mousePointer.worldX,
  //         y: this.input.mousePointer.worldY
  //       });
  //     }
  //   } else {
  //     this.gameHud.setTestText("FALSE")
  //   }
  // }

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