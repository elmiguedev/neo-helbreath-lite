import { Scene } from "phaser";
import { GameState } from "../sockets/domain/GameState";

export class GameHud extends Scene {
  private gameState: GameState;
  private txtPlayers: Phaser.GameObjects.Text;
  private txtTest: Phaser.GameObjects.Text;

  constructor() {
    super("GameHud");
  }

  create() {
    this.createPlayers();
    this.txtTest = this.add.text(
      this.game.canvas.width / 2,
      10,
      "",
      {
        fontFamily: "half_bold_pixel",
        fontSize: "24px",
        color: "black",
        align: "center"
      }
    );
  }

  update() {
    this.updatePlayers();
  }

  public setGameState(gameState: GameState) {
    this.gameState = gameState;
  }

  private createPlayers() {
    this.txtPlayers = this.add.text(
      10,
      10,
      "",
      {
        fontFamily: "half_bold_pixel",
        fontSize: "24px",
        color: "black",
        align: "left"
      }
    )
  }

  private updatePlayers() {
    if (!this.gameState) return;
    let players = "";
    Object.values(this.gameState.players)
      .sort((a, b) => b.score - a.score)
      .forEach((player) => {
        players += `${player.name}: ${player.score}\n`;
      })
    this.txtPlayers.setText(players);
  }

  public setTestText(value: string) {
    this.txtTest.setText(value);
  }
}