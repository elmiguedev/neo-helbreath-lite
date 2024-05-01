import { Scene } from "phaser";
import { TextField } from "../components/TextField";
import { Button } from "../components/Button";

export class StartScene extends Scene {
  private nameTextField: TextField;
  private playButton: Button;

  constructor() {
    super("StartScene");
  }

  create() {
    this.createBackground();
    this.createNameTextField();
    this.createPlayButton();
  }

  private createBackground() {
    this.cameras.main.setBackgroundColor(0xffffff);
    this.add.grid(0, 0, 2048, 2048, 32, 32, 0xffffff, 1, 0xeeeeee).setOrigin(0);
  }

  private createNameTextField() {
    const x = this.game.canvas.width / 2;
    const y = 200;
    this.nameTextField = new TextField(this, x, y);
    this.nameTextField.onKeyEnter = () => {
      this.startGame();
    }
  }

  private createPlayButton() {
    const x = this.game.canvas.width / 2;
    const y = 270;
    this.playButton = new Button(this, x, y);
    this.playButton.onClick = () => {
      this.startGame();
    }
  }

  private startGame() {
    this.scene.start("GameScene", { name: this.nameTextField.getText() });
  }
}