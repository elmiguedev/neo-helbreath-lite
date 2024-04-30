export class TextField extends Phaser.GameObjects.Container {
  private txt: HTMLInputElement;
  private dom: Phaser.GameObjects.DOMElement;

  public onKeyEnter?: Function;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y);
    this.scene.add.existing(this);
    this.createInputText();
  }

  private createInputText() {
    this.txt = document.createElement("input");
    this.txt.type = "text";
    this.txt.style.borderRadius = "0";
    this.txt.style.backgroundColor = "white";
    this.txt.style.border = "4px solid black";
    this.txt.style.outline = "none";
    this.txt.style.padding = "3px";
    this.txt.style.height = "32px";
    this.txt.style.fontFamily = "half_bold_pixel";
    this.txt.style.fontSize = "24px";
    this.txt.style.textAlign = "center";
    this.txt.style.width = "200px";
    this.txt.style.height = "42px";
    this.txt.maxLength = 24;
    this.txt.onkeydown = (event) => {
      if (event.key === "Enter") {
        if (this.onKeyEnter) {
          this.onKeyEnter();
        }
      }
    }

    this.dom = this.scene.add.dom(0, 0, this.txt)
    this.add(this.dom);
  }

  public getText() {
    return this.txt.value;
  }
}