import { Player } from "../../domain/Player";
import { StatBar } from "../components/StatBar";

export class PlayerEntity extends Phaser.GameObjects.Sprite {
  private playerState: Player;
  private playerLabel: Phaser.GameObjects.Text;
  private hpBar: StatBar;
  private hurtSound: Phaser.Sound.BaseSound;

  public onDie?: Function;

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
    }
  }

  public getId() {
    return this.playerState.id;
  }

  public setPlayerState(playerState: Player) {
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
    this.setPosition(this.playerState.position.x, this.playerState.position.y);
    this.setDepth(this.playerState.position.y);
    if (this.playerState.targetPosition) {
      this.setFlipX(this.playerState.targetPosition?.x < this.playerState.position.x);
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
      delay: 5000,
      callback: () => {
        if (this.onDie) this.onDie();
      }
    })

  }

  private createSounds() {
    this.hurtSound = this.scene.sound.add("hurt", { volume: 0.5 });
  }
}