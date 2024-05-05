import { Scene } from "phaser";
import { SocketManager } from "../sockets/SocketManager";
import { PlayerEntity } from "../entities/PlayerEntity";
import { MonsterEntity } from "../entities/MonsterEntity"
import { GameHud } from "../huds/GameHud";

export class GameScene extends Scene {
  private socketManager: SocketManager;
  private players: Record<string, PlayerEntity> = {};
  private monsters: Record<string, MonsterEntity> = {};
  private playerName: string;
  private gameHud: GameHud;

  private keys: {
    left: Phaser.Input.Keyboard.Key;
    right: Phaser.Input.Keyboard.Key;
    up: Phaser.Input.Keyboard.Key;
    down: Phaser.Input.Keyboard.Key;
  }

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
    // this.createMusic();
    this.createInput();
    this.createKeyInputs();
  }

  update() {
    this.updatePlayers();
    this.updateMonsters();
    this.checkKeyInput();
  }

  createSocketManager() {
    this.players = {}
    this.monsters = {}
    this.socketManager = new SocketManager(
      this,
      this.players,
      this.monsters,
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
    this.input.on("pointerdown", (pointer: any, gameObjects: any[]) => {
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

    this.input.on("pointermove", (pointer: any, gameObjects: any[]) => {
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

  private createKeyInputs() {
    this.keys = {
      left: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      right: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D),
      up: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      down: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.S),
    }
  }

  private checkKeyInput() {
    const player = this.getMainPlayer();
    if (player) {
      this.socketManager.notifyPlayerKeysMove({
        left: this.keys.left.isDown,
        right: this.keys.right.isDown,
        up: this.keys.up.isDown,
        down: this.keys.down.isDown
      });
    }
  }

  private updatePlayers() {
    for (const id in this.players) {
      if (this.players[id])
        this.players[id].update();
    }
  }

  private updateMonsters() {
    for (const id in this.monsters) {
      if (this.monsters[id])
        this.monsters[id].update();
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

  private getMainPlayer() {
    if (this.socketManager.getId()) {
      const playerId: string = this.socketManager.getId()!;
      const player = this.players[playerId];
      return player;
    }
  }

}