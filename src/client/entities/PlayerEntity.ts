import { Player } from "../../domain/Player";
import { Position } from "../../domain/Position";
import { StatBar } from "../components/StatBar";
import { Utils } from "../utils/Utils";

export class PlayerEntity extends Phaser.GameObjects.Sprite {
  private playerState: Player;
  private playerLabel: Phaser.GameObjects.Text;
  private hpBar: StatBar;
  private hurtSound: Phaser.Sound.BaseSound;

  public onDie?: Function;

  private clientStateBuffer: any[] = [];
  private clientInputBuffer: any[] = [];
  public inputTickNumber = 0;

  constructor(scene: Phaser.Scene, playerState: Player) {
    super(scene, playerState.position.x, playerState.position.y, "player");
    this.playerState = playerState;
    this.scene.add.existing(this);
    this.setTint(playerState.color);
    this.anims.createFromAseprite("player");
    this.setInteractive({ cursor: "pointer" });
    this.createLabel();
    this.createHpBar()
    this.createSounds();
  }

  public update() {
    if (this.active && this.visible) {
      this.updatePosition();
      this.updateAnimations();
      this.updateLabel();
      this.updateHpBar();
      ++this.inputTickNumber;
    }
  }

  public getId() {
    return this.playerState.id;
  }

  public setPlayerState(playerState: Player) {
    this.playerState = playerState;
    this.serverDelay = Date.now();
  }

  public destroy(): void {
    super.destroy(true);
    this.playerLabel.destroy(true)
    this.hpBar.destroy(true);
  }

  public getState() {
    return this.playerState.state;
  }

  private updateAnimations() {
    switch (this.playerState.state) {
      case 'dead': this.die(); break;
      case 'hurt': this.playHurtAnimation(); break;
      case 'walk': this.playWalkAnimation(); break;
      case 'attack': this.playAttackAnimation(); break;
      case 'absorb': this.playAbsorbAnimation(); break;
      case 'idle':
      default:
        this.playIdleAnimation();
        break;
    }
  }

  private playIdleAnimation() {
    this.play({
      key: "idle",
      timeScale: 0.3,
      repeat: -1,
    }, true);
  }

  private playWalkAnimation() {
    this.play({
      key: "walk",
      timeScale: 0.7,
      repeat: -1,
    }, true);
  }

  private playAttackAnimation() {
    this.setFlipX(this.scene.input.mousePointer.worldX < this.x);
    this.play({
      key: "attack",
      timeScale: 0.3,
      repeat: -1,
    }, true);
  }

  private playHurtAnimation() {
    if (!this.hurtSound.isPlaying) {
      this.hurtSound.play({ delay: 0.1 });
    }
    this.play({
      key: "hurt",
      timeScale: 0.3,
      repeat: -1,
    }, true);
  }

  private playDeadAnimation() {
    this.play({
      key: "dead",
      timeScale: 0.3,
      repeat: -1,
    }, true);
  }

  private playAbsorbAnimation() {
    this.play({
      key: "absorb",
      timeScale: 0.3,
      repeat: -1,
    }, true);
  }

  private createLabel() {
    this.playerLabel = this.scene.add.text(this.x, this.y - 40, this.playerState.name, {
      color: "black",
      fontFamily: "half_bold_pixel",
      fontSize: "24px",
      align: "center"
    }).setOrigin(0.5, 0.5);
  }

  private updateLabel() {
    if (this.playerLabel && this.playerLabel.active) {
      this.playerLabel.setPosition(this.x, this.y - 80);
      this.playerLabel.setAlign("center");
      this.playerLabel.setText(`(${this.playerState.level})\n${this.playerState.name}`);
      this.playerLabel.setDepth(this.depth);
    }
  }

  private updatePosition() {
    // 1. obtengo el state (ya lo tengo)
    if (this.clientTargetPosition) {

      const newPosition = Utils.constantLerpPosition(
        this.x,
        this.y,
        this.clientTargetPosition?.x,
        this.clientTargetPosition?.y,
        4
      );
      this.setPosition(newPosition.x, newPosition.y);
      const distance = Utils.distanceBetween(newPosition, this.clientTargetPosition);
      if (distance < 4) {
        this.setPosition(this.clientTargetPosition.x, this.clientTargetPosition.y);
        this.clientTargetPosition = undefined;
      }

    } else {
      if (this.playerState.position) {
        this.setPosition(this.playerState.position.x, this.playerState.position.y);
      }
    }
    // 2. calculo el index dentro del buffer
    const bufferSlot = this.playerState.tickNumber % 512;

    // 3. calculo el error
    const xError = this.playerState.position.x - this.clientStateBuffer[bufferSlot]?.position.x || 0;
    const yError = this.playerState.position.y - this.clientStateBuffer[bufferSlot]?.position.y || 0;
    const error = Math.sqrt(xError * xError + yError * yError);

    if (error > 4) {
      // 4. si el error supera un cierto  umbral, rewind y actualizo con server
      // this.setPosition(this.playerState.position.x, this.playerState.position.y);
      const newPosition = Utils.constantLerpPosition(
        this.x,
        this.y,
        this.playerState.position.x,
        this.playerState.position.y,
        4
      );

      // 5. como el tickNumber dle state y no del input. 
      let rewindTickNumber = this.playerState.tickNumber;

      // 6. recorremos todos los buffers y actualizamos los ticks
      while (rewindTickNumber < this.inputTickNumber) {
        const rewindBufferSlot = rewindTickNumber % 512;
        const rewindClientState = this.clientStateBuffer[rewindBufferSlot];
        if (rewindClientState) {
          this.clientInputBuffer[rewindBufferSlot] = this.clientTargetPosition;
          this.clientStateBuffer[rewindBufferSlot].position = newPosition;
          this.setPosition(newPosition.x, newPosition.y);
        }
        ++rewindTickNumber;
      }
    }

  }

  private createHpBar() {
    this.hpBar = new StatBar(
      this.scene,
      {
        x: this.x,
        y: this.y,
        color: 0x00ff00,
        max: this.playerState.maxHp,
        value: this.playerState.hp,
      }
    );
    this.hpBar.showLabel();
  }

  private updateHpBar() {
    if (this.hpBar && this.hpBar.active) {
      this.hpBar.setPosition(this.x - 25, this.y - 40);
      this.hpBar.setDepth(this.depth);
      this.hpBar.setValue(this.playerState.hp);
      this.hpBar.setMaxValue(this.playerState.maxHp);
    }
  }

  private die() {
    this.playDeadAnimation();
    this.scene.time.addEvent({
      delay: 2000,
      callback: () => {
        if (this.onDie) this.onDie();
      }
    })

  }

  private createSounds() {
    this.hurtSound = this.scene.sound.add("hurt", { volume: 0.5 });
  }


  // PUBLIC LO NUEVO
  private clientTargetPosition?: Position;
  private serverDelay: number;
  public setClientTargetPosition(targetPosition: Position) {
    this.clientTargetPosition = targetPosition;
  }
}