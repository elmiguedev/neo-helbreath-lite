import { Player } from "../../domain/Player";

export class PlayerEntity extends Phaser.GameObjects.Sprite {
  private playerState: Player;
  private playerLabel: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene, playerState: Player) {
    super(scene, playerState.position.x, playerState.position.y, "player");
    this.playerState = playerState;

    this.scene.add.existing(this);
    this.setTint(playerState.color);
    this.anims.createFromAseprite("player");
    this.setInteractive({ cursor: "pointer" });
    this.createLabel();
  }

  public update() {
    this.updateAnimations();
    this.updatePosition();
    this.updateLabel();
  }

  public setPlayerState(playerState: Player) {
    this.playerState = playerState;
  }

  private updateAnimations() {
    switch (this.playerState.state) {
      case 'walk': this.playWalkAnimation(); break;
      case 'attack': this.playAttackAnimation(); break;
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
    this.play({
      key: "attack",
      frameRate: 5,
      repeat: -1,
    }, true);
  }

  private createLabel() {
    this.playerLabel = this.scene.add.text(this.x, this.y - 40, this.playerState.name, {
      color: "black",
      fontSize: "16px",
      align: "center"
    }).setOrigin(0.5, 0.5);
  }

  private updateLabel() {
    if (this.playerLabel) {
      this.playerLabel.setPosition(this.x, this.y - 40);
      this.playerLabel.setText(`${this.playerState.name} (${this.playerState.state})`);
    }
  }

  private updatePosition() {
    this.setPosition(this.playerState.position.x, this.playerState.position.y);
    this.setDepth(this.playerState.position.y);
    if (this.playerState.targetPosition) {
      this.setFlipX(this.playerState.targetPosition?.x < this.playerState.position.x);
    }
  }
}