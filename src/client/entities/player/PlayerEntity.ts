import { StatBar } from "../../components/StatBar";
import { PlayerGameState } from "../../sockets/domain/player/PlayerGameState";
import { Utils } from "../../utils/Utils";
import { Position } from "../Poisition";

export class PlayerEntity extends Phaser.GameObjects.Sprite {
  private playerState: PlayerGameState;
  private playerLabel: Phaser.GameObjects.Text;
  private hpBar: StatBar;
  private mainPlayer: boolean = false;

  public onDie?: Function;

  constructor(scene: Phaser.Scene, playerState: PlayerGameState) {
    super(scene, playerState.position.x, playerState.position.y, "player");
    this.playerState = playerState;
    this.scene.add.existing(this);
    this.anims.createFromAseprite("player");
    this.setInteractive({ cursor: "pointer" });
    this.createLabel();
    this.createHpBar()
  }

  public setMainPlayer(mainPlayer: boolean) {
    this.mainPlayer = mainPlayer;
  }

  public update() {
    if (this.active && this.visible) {
      this.updatePosition();
      this.updateAnimations();
      this.updateLabel();
      this.updateHpBar();
    }
  }

  public getId() {
    return this.playerState.id;
  }

  public setPlayerState(playerState: PlayerGameState) {
    this.playerState = playerState;
  }

  public destroy(): void {
    super.destroy(true);
    this.playerLabel.destroy(true)
    this.hpBar.destroy(true);
  }

  public getState() {
    return this.playerState.state;
  }

  public getPlayerState() {
    return this.playerState;
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
    if (this.mainPlayer) {
      this.scene.cameras.main.shake(30, 0.002);
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
      this.playerLabel.setText(`(${this.playerState.stats.level})\n${this.playerState.name}`);
      this.playerLabel.setDepth(this.depth);
    }
  }

  private updatePosition() {

    // 1. si tiene clientTargetPosition quiere decir que queremos
    // predecir la ubicacion
    // this.updateClientPosition();


    // ORIGINAL CODE
    // ----------------
    this.setPosition(this.playerState.position.x, this.playerState.position.y);
    this.setDepth(this.y);
    if (this.playerState.targetPosition) {
      this.setFlipX(this.playerState.targetPosition.x < this.x);
    }
    // ----------------
    // ORIGINAL CODE
  }

  private createHpBar() {
    this.hpBar = new StatBar(
      this.scene,
      {
        x: this.x,
        y: this.y,
        color: 0x00ff00,
        max: this.playerState.stats.maxHealth,
        value: this.playerState.stats.health,
      }
    );
    this.hpBar.showLabel();
  }

  private updateHpBar() {
    if (this.hpBar && this.hpBar.active) {
      this.hpBar.setPosition(this.x - 25, this.y - 40);
      this.hpBar.setDepth(this.depth);
      this.hpBar.setValue(this.playerState.stats.health);
      this.hpBar.setMaxValue(this.playerState.stats.maxHealth);
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

  // LO NUEVO
  // --------------------------
  private clientTargetPosition?: Position;
  private clientHasEnemyTarget: boolean = false;
  public setClientTargetPosition(position: Position) {
    this.clientTargetPosition = position;
  }

  public setClientEnemyTarget(value: boolean) {
    this.clientHasEnemyTarget = value;
  }

  private updateClientPosition() {
    if (this.isDead()) return;
    if (this.clientTargetPosition) {
      this.moveClientPlayer();
    } else {
      this.moveServerPlayer();
    }
  }


  private validationCount = 0;
  private moveClientPlayer() {
    if (!this.clientTargetPosition) return;

    const position = Utils.moveTowardsTarget(
      this.x,
      this.y,
      this.clientTargetPosition!.x,
      this.clientTargetPosition!.y,
      4
    );



    if (!this.isOnRange(position)) {

      this.setPosition(position.x, position.y);

    } else
    // const targetDistance = Utils.distanceBetweenPoints(
    //   position.x,
    //   position.y,
    //   this.clientTargetPosition.x,
    //   this.clientTargetPosition.y
    // );

    // console.log(targetDistance < this.getTargetValidationDistance())

    // if (targetDistance < this.getTargetValidationDistance()) {
    {
      // this.setPosition(position.x, position.y);
      // this.clientTargetPosition = undefined

      if (position === this.playerState.position) {
        this.validationCount = 0;
        this.setPosition(this.playerState.position.x, this.playerState.position.y);
      } else {
        this.validationCount++;
        if (this.validationCount > 1000) {
          this.validationCount = 0;
          this.clientTargetPosition = undefined
          this.setPosition(this.playerState.position.x, this.playerState.position.y);
        }
      }
    }

    this.setDepth(this.y + 10);
    if (this.clientTargetPosition) {
      this.setFlipX(this.clientTargetPosition.x < this.x);
    }
  }

  private moveServerPlayer() {
    // TODO: esto es cuestionable porque cuando 
    //       por alguna razon no tenga target
    //      por ejemplo con un portal, no se va a mover
    if (!this.playerState.targetPosition) return;

    const position = Utils.moveTowardsTarget(
      this.playerState.position.x,
      this.playerState.position.y,
      this.playerState.targetPosition!.x,
      this.playerState.targetPosition!.y,
      4
    );

    if (!this.serverIsOnRange(position)) {
      this.setPosition(position.x, position.y);
    } else {
      this.setPosition(this.playerState.position.x, this.playerState.position.y);
    }

    this.setDepth(this.y + 10);
    if (this.playerState.targetPosition) {
      this.setFlipX(this.playerState.targetPosition.x < this.playerState.position.x);
    }
  }

  private getTargetValidationDistance() {
    return this.clientHasEnemyTarget
      ? 70
      : 4
  }

  private isOnRange(position: Position) {
    if (!this.clientTargetPosition) return false;
    const targetDistance = Utils.distanceBetweenPoints(
      position.x,
      position.y,
      this.clientTargetPosition.x,
      this.clientTargetPosition.y
    );

    return targetDistance < this.getTargetValidationDistance();
  }

  private serverIsOnRange(position: Position) {
    if (!this.playerState.targetPosition) return false;
    const targetDistance = Utils.distanceBetweenPoints(
      position.x,
      position.y,
      this.playerState.targetPosition.x,
      this.playerState.targetPosition.y
    );

    return targetDistance < this.getTargetValidationDistance();
  }

  private isDead() {
    return this.playerState.state === "dead";
  }

}