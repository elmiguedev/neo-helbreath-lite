import { Scene } from "phaser";

const BAR_SIZE = 50;

export class StatBar extends Phaser.GameObjects.Container {

  private background: Phaser.GameObjects.Rectangle;
  private bar: Phaser.GameObjects.Rectangle;
  private max: number;
  private value: number;

  constructor(scene: Scene, x: number, y: number, color: number, max: number, value?: number) {
    super(scene, x, y);
    this.scene.add.existing(this);

    this.max = max;
    this.value = value || max;
    this.background = this.scene.add.rectangle(
      0,
      0,
      BAR_SIZE,
      8,
      0xcccccc
    ).setOrigin(0);

    this.bar = this.scene.add.rectangle(
      0,
      0,
      BAR_SIZE,
      8,
      color
    ).setOrigin(0);

    this.add(this.background)
    this.add(this.bar)
  }
  //363294

  public increase(value: number) {
    this.value += value;
    if (this.value > this.max)
      this.value = this.max;
    this.updateBar();
  }

  public decrease(value: number) {
    this.value -= value;
    if (this.value < 0)
      this.value = 0;
    this.updateBar();
  }

  public setValue(value: number) {
    this.value = value;
    if (this.value > this.max) this.value = this.max;
    if (this.value < 0) this.value = 0;
    this.updateBar();
  }

  private updateBar() {
    const size = Math.floor((this.value * BAR_SIZE) / this.max)
    if (this.bar)
      this.bar.setSize(size, this.bar.height);
  }

}