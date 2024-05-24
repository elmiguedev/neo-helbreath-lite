import { Scene } from "phaser";
import { GameState } from "../sockets/domain/GameState";
import { PlayerStats } from "../sockets/domain/player/Player";

export class GameHud extends Scene {
  private gameState: GameState;
  private playerId: string;

  private txtPlayers: Phaser.GameObjects.Text;
  private txtTest: Phaser.GameObjects.Text;

  public onStatUpdate?: (stats: PlayerStats) => void;

  constructor() {
    super("GameHud");
  }

  create() {
    this.createPlayers();
    this.createTestText();
  }

  update() {
    this.updatePlayers();
  }

  public setGameState(gameState: GameState) {
    this.gameState = gameState;
  }

  public setPlayerId(playerId: string) {
    this.playerId = playerId;
  }

  public setTestText(value: string) {
    this.txtTest.setText(value);
  }

  private getPlayer() {
    if (!this.playerId || !this.gameState) return;
    return this.gameState.players[this.playerId];
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

  private createTestText() {
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

}