export class TextField extends Phaser.GameObjects.Container {
  private txt: HTMLInputElement;
  private dom: Phaser.GameObjects.DOMElement;

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
    this.txt.style.border = "2px solid black";
    this.txt.style.outline = "none";
    this.txt.style.padding = "5px";
    this.txt.style.height = "32px";
    this.txt.style.fontFamily = "Roboto";
    this.txt.style.fontSize = "24px";
    this.txt.style.textAlign = "center";
    this.txt.style.width = "200px";

    this.dom = this.scene.add.dom(0, 0, this.txt)
    this.add(this.dom);
  }

  public getText() {
    return this.txt.value;
  }
}