import { Scene } from "phaser";

const BAR_WIDTH = 50;
const BAR_HEIGHT = 8;

export interface StatBarProps {
  x: number;
  y: number;
  color: number;
  max: number;
  value?: number;
  width?: number;
  height?: number;
  borderWidth?: number;
  borderColor?: number;
}

export class StatBar extends Phaser.GameObjects.Container {
  private props: StatBarProps;
  private borderBackground: Phaser.GameObjects.Rectangle;
  private background: Phaser.GameObjects.Rectangle;
  private bar: Phaser.GameObjects.Rectangle;
  private max: number;
  private value: number;
  private label: Phaser.GameObjects.Text;

  constructor(scene: Scene, props: StatBarProps) {
    super(scene, props.x, props.y);
    this.props = props;
    this.scene.add.existing(this);

    this.max = props.max;
    this.value = props.value || props.max;

    if (props.borderWidth) {
      this.borderBackground = this.scene.add.rectangle(
        0,
        0,
        props.width || BAR_WIDTH,
        props.height || BAR_HEIGHT,
        props.borderColor || 0x000000
      ).setOrigin(0)
      this.add(this.borderBackground)
    }

    this.background = this.scene.add.rectangle(
      props.borderWidth || 0,
      props.borderWidth || 0,
      this.getMaxWidth(),
      this.getMaxHeight(),
      0xcccccc
    ).setOrigin(0);

    this.bar = this.scene.add.rectangle(
      props.borderWidth || 0,
      props.borderWidth || 0,
      this.getMaxWidth(),
      this.getMaxHeight(),
      props.color
    ).setOrigin(0);

    this.createLabel();

    this.add(this.background)
    this.add(this.bar)
    this.add(this.label);
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

  public setMaxValue(value: number) {
    this.max = value;
    this.updateBar();
  }

  private updateBar() {
    const size = Math.floor((this.value * this.getMaxWidth()) / this.max)
    if (this.bar) {
      this.bar.setSize(size, this.bar.height);
      this.updateLabel();
    }
  }

  private getMaxWidth() {
    return this.props.borderWidth
      ? (this.props.width || BAR_WIDTH) - (this.props.borderWidth * 2)
      : this.props.width || BAR_WIDTH;
  }

  private getMaxHeight() {
    return this.props.borderWidth
      ? (this.props.height || BAR_HEIGHT) - (this.props.borderWidth * 2)
      : this.props.height || BAR_HEIGHT;
  }

  private createLabel() {
    this.label = this.scene.add.text(0, 0, "", {
      fontFamily: "half_bold_pixel",
      fontSize: "8px",
      color: "black",
      align: "left"
    });
  }

  private updateLabel() {
    if (this.label.visible) {
      this.label.setText(`${this.value}/${this.max}`);
    }
  }

}