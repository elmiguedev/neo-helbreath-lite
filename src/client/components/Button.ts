export class Button extends Phaser.GameObjects.Container {
  private button: HTMLButtonElement;
  private dom: Phaser.GameObjects.DOMElement;
  public onClick?: Function;
  private text: string;

  constructor(scene: Phaser.Scene, x: number, y: number, text?: string) {
    super(scene, x, y);
    this.text = text || "";
    this.scene.add.existing(this);
    this.createInputText();
  }

  public setText(value: string) {
    this.text = value;
    this.button.textContent = this.text;
  }

  private createInputText() {
    const BASE_COLOR = "#847e87";
    const OVER_COLOR = "#928f94";
    const CLICKED_COLOR = "#787579"

    this.button = document.createElement("button");
    this.button.style.width = "214px";
    this.button.type = "button";
    this.button.style.borderRadius = "0";
    this.button.style.backgroundColor = BASE_COLOR;
    this.button.style.border = "4px solid black";
    this.button.style.cursor = "pointer";
    this.button.style.padding = "5px";
    this.button.style.height = "64px";
    this.button.style.fontFamily = "half_bold_pixel";
    this.button.style.fontSize = "24px";
    this.button.style.textAlign = "center";
    this.button.style.color = "black";
    this.button.style.outline = "none";
    this.button.textContent = this.text;

    this.button.onmouseenter = () => {
      this.button.style.backgroundColor = OVER_COLOR;
    }
    this.button.onmouseleave = () => {
      this.button.style.backgroundColor = BASE_COLOR;
    }

    this.button.onmousedown = () => {
      this.button.style.backgroundColor = CLICKED_COLOR;
    }

    this.button.onmouseup = () => {
      this.button.style.backgroundColor = OVER_COLOR;
    }

    this.button.onclick = () => {
      if (this.onClick) {
        this.onClick();
      }
    }

    this.dom = this.scene.add.dom(0, 0, this.button)
    this.add(this.dom);
  }
}