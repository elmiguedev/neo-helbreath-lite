import { Scene } from "phaser";
import { GameState } from "../sockets/domain/GameState";
import { PlayerStatBar } from "../components/PlayerStatBar";
import { PlayerStats } from "../../domain/Player";
import { ToggleButton } from "../components/ToggleButton";

export class GameHud extends Scene {
  private gameState: GameState;
  private playerId: string;
  private disableMouseMovementButton: ToggleButton;
  public disableMouseMovement: boolean = false;

  private txtPlayers: Phaser.GameObjects.Text;
  private vitalityBar: PlayerStatBar;
  private dexteryBar: PlayerStatBar;
  private strengthBar: PlayerStatBar;
  private txtTest: Phaser.GameObjects.Text;

  public onStatUpdate?: (stats: PlayerStats) => void;

  constructor() {
    super("GameHud");
  }

  create() {
    this.createPlayers();
    this.createTestText();
    this.createStatBars();
    this.createDisableMouseMovementButton();
  }

  update() {
    this.updatePlayers();
    this.updateStatBars();
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

  private createStatBars() {
    const x = 20;
    const y = this.game.canvas.height - 220;
    const barSeparation = 60;
    const maxValue = 20;

    this.vitalityBar = new PlayerStatBar(
      this,
      x,
      y,
      0xcf53cf,
      maxValue
    )
    this.vitalityBar.setLabel("Vitality:")

    this.dexteryBar = new PlayerStatBar(
      this,
      x,
      y + barSeparation,
      0x7bc17f,
      maxValue,
    );
    this.dexteryBar.setLabel("Dextery:")

    this.strengthBar = new PlayerStatBar(
      this,
      x,
      y + (barSeparation) * 2,
      0x6975b2,
      maxValue,
    );
    this.strengthBar.setLabel("Strength:")

    this.vitalityBar.onButtonClick = () => {
      this.onStatUpdate && this.onStatUpdate({
        vitality: 1,
        dextery: 0,
        strength: 0
      });
    }

    this.dexteryBar.onButtonClick = () => {
      this.onStatUpdate && this.onStatUpdate({
        vitality: 0,
        dextery: 1,
        strength: 0
      });
    }

    this.strengthBar.onButtonClick = () => {
      this.onStatUpdate && this.onStatUpdate({
        vitality: 0,
        dextery: 0,
        strength: 1
      });
    }

  }

  private updateStatBars() {
    const player = this.getPlayer();
    if (!player) return;
    this.vitalityBar.setValue(player.stats.vitality)
    this.vitalityBar.setEnabled(player.availablePoints > 0)

    this.dexteryBar.setValue(player.stats.dextery)
    this.dexteryBar.setEnabled(player.availablePoints > 0)

    this.strengthBar.setValue(player.stats.strength)
    this.strengthBar.setEnabled(player.availablePoints > 0)
  }

  private createDisableMouseMovementButton() {
    this.disableMouseMovementButton = new ToggleButton(
      this,
      this.game.canvas.width / 2,
      this.game.canvas.height - 60,
      "Enable Mouse Movement",
      "Disable Mouse Movement"
    );
    this.disableMouseMovementButton.onToggle = (value: boolean) => {
      this.disableMouseMovement = value;
    }
  }
}