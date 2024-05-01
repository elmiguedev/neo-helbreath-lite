import { StatBar } from "./StatBar";

const BAR_WIDTH = 120;
const BAR_HEIGHT = 24;
const BORDER_WIDTH = 4;

export class PlayerStatBar extends Phaser.GameObjects.Container {
  private statBar: StatBar;
  private button: Phaser.GameObjects.Image;
  private label: Phaser.GameObjects.Text;
  private color: number;
  private maxValue?: number;

  public onButtonClick?: Function;

  constructor(scene: Phaser.Scene, x: number, y: number, color: number, maxValue?: number) {
    super(scene, x, y);
    this.color = color;
    this.maxValue = maxValue;
    this.scene.add.existing(this);

    this.createStatBar();
    this.createButton();
    this.createLabel();
  }

  public setEnabled(enabled: boolean) {
    this.button.setVisible(enabled);
  }

  public setMaxValue(value: number) {
    this.statBar.setMaxValue(value);
  }

  public setValue(value: number) {
    this.statBar.setValue(value);
  }

  public setLabel(value: string) {
    this.label.setText(value);
    this.statBar.setPosition(
      0,
      this.label.displayHeight + 4
    );
    this.button.setPosition(
      BAR_WIDTH + 4,
      this.label.displayHeight + 4
    );
  }

  private createLabel() {
    this.label = this.scene.add.text(
      0,
      0,
      "",
      {
        fontFamily: "half_bold_pixel",
        fontSize: "24px",
        color: "black",
        align: "left"
      }
    );
    this.label.setOrigin(0);
    this.add(this.label);
  }

  private createStatBar() {
    this.statBar = new StatBar(this.scene, {
      x: 0,
      y: 0,
      color: this.color,
      max: this.maxValue || 20,
      value: 1,
      width: BAR_WIDTH,
      height: BAR_HEIGHT,
      borderWidth: BORDER_WIDTH
    });
    this.add(this.statBar);
  }

  private createButton() {
    this.button = this.scene.add.image(
      BAR_WIDTH + 4,
      0,
      "stat_button"
    );
    this.button.setOrigin(0);
    this.button.setVisible(false);
    this.button.setInteractive({ cursor: "pointer" });
    this.button.on("pointerdown", () => {
      if (this.onButtonClick) {
        this.onButtonClick();
      }
    });

    this.add(this.button);
  }


}