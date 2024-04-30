import io, { Socket } from "socket.io-client";
import { GameStateHandler } from "./handlers/GameStateHandler";
import { GAME_STATE_MESSAGE, PLAYER_ATTACK_MESSAGE, PLAYER_DISCONNECTED_MESSAGE, PLAYER_MOVE_MESSAGE } from "../../domain/Messages";
import { Position } from "../../domain/Position";
import { PlayerDisconnectedHandler } from "./handlers/PlayerDisconnectedHandler";
import { PlayerEntity } from "../entities/PlayerEntity";
import { Scene } from "phaser";
import { GameHud } from "../huds/GameHud";
import { GameState } from "./domain/GameState";

const DEFAULT_SERVER_URL = "http://localhost:3000";
const SERVER_URL = import.meta.env.DEV ? DEFAULT_SERVER_URL : ""

export class SocketManager {
  private socket: Socket;
  private gameStateHandler: GameStateHandler;
  private playerDisconnectedHandler: PlayerDisconnectedHandler;
  private gameState: GameState;

  constructor(
    private readonly scene: Scene,
    private readonly players: Record<string, PlayerEntity>,
    private readonly playerName: string,
    private readonly gameHud: GameHud
  ) {
    this.socket = io(SERVER_URL, {
      query: {
        name: this.playerName
      }
    });
    this.socket.on("connect", () => {
      this.gameStateHandler = new GameStateHandler(this, this.scene, this.players, this.gameHud);
      this.playerDisconnectedHandler = new PlayerDisconnectedHandler(this.players);
      this.socket.on(GAME_STATE_MESSAGE, this.gameStateHandler.execute.bind(this.gameStateHandler));
      this.socket.on(PLAYER_DISCONNECTED_MESSAGE, this.playerDisconnectedHandler.execute.bind(this.playerDisconnectedHandler))
    })

  }

  public getId() {
    return this.socket.id;
  }

  public notifyPlayerMove(position: Position) {
    if (this.socket.connected && this.socket.id) {
      this.socket.emit(PLAYER_MOVE_MESSAGE, position)
    }
  }

  public notifyPlayerAttack(id: string) {
    if (this.socket.connected) {
      this.socket.emit(PLAYER_ATTACK_MESSAGE, id);
    }
  }

  public disconnect() {
    this.socket.disconnect();
  }
}