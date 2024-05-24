import Phaser from "phaser";
import { Monster } from "../sockets/domain/Monster";

export class MonsterEntity extends Phaser.GameObjects.Sprite {
  public monsterState: Monster;
  public onDie?: Function;


  constructor(scene: Phaser.Scene, monsterState: Monster) {
    super(scene, monsterState.position.x, monsterState.position.y, monsterState.type);
    this.monsterState = monsterState;

    this.scene.add.existing(this);
    this.anims.createFromAseprite(this.monsterState.type);

    this.setInteractive({ cursor: "pointer" });

  }

  public update() {
    super.update();
    if (this.active && this.visible) {
      // this.updatePosition();
      this.updateAnimations();
    }
  }

  public setMonsterState(state: Monster) {
    this.monsterState = state;
  }

  private updateAnimations() {
    switch (this.monsterState.state) {
      case 'dead': this.die(); break;
      case 'hurt': this.playHurtAnimation(); break;
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
    this.setFlipX(this.scene.input.mousePointer.worldX < this.x);
    this.play({
      key: "attack",
      timeScale: 0.3,
      repeat: -1,
    }, true);
  }

  private playHurtAnimation() {
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

  private die() {
    this.playDeadAnimation();
    this.scene.time.addEvent({
      delay: 2000,
      callback: () => {
        if (this.onDie) this.onDie();
      }
    })
  }
}