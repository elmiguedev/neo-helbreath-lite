import { Scene } from "phaser";
import { TextField } from "../components/TextField";
import { Button } from "../components/Button";

export class StartScene extends Scene {
  private nameTextField: TextField;
  private playButton: Button;
  private name?: string;

  constructor() {
    super("StartScene");
  }

  init(data: any) {
    this.name = data.name
  }

  create() {
    this.createBackground();
    this.createNameTextField();
    this.createPlayButton();
  }

  private createBackground() {
    this.cameras.main.setBackgroundColor(0x90c18a);
  }

  private createNameTextField() {
    const x = this.game.canvas.width / 2;
    const y = 200;
    this.nameTextField = new TextField(this, x, y);
    if (this.name) {
      this.nameTextField.setText(this.name);
    }
    this.nameTextField.onKeyEnter = () => {
      this.startGame();
    }
  }

  private createPlayButton() {
    const x = this.game.canvas.width / 2;
    const y = 270;
    this.playButton = new Button(this, x, y, "Play");
    this.playButton.onClick = () => {
      this.startGame();
    }
  }

  private startGame() {
    this.scene.start("GameScene", { name: this.nameTextField.getText() });
  }
}