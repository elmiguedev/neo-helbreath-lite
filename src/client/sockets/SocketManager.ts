import io, { Socket } from "socket.io-client";
import { GameStateHandler } from "./handlers/GameStateHandler";
import { GAME_STATE_MESSAGE, PLAYER_ATTACK_MESSAGE, PLAYER_CANCEL_MESSAGE, PLAYER_DISCONNECTED_MESSAGE, PLAYER_KEYS_MOVE_MESSAGE, PLAYER_MOVE_MESSAGE, PLAYER_STATS_UPDATE_MESSAGE } from "../../domain/Messages";
import { Position } from "../../domain/Position";
import { PlayerDisconnectedHandler } from "./handlers/PlayerDisconnectedHandler";
import { PlayerEntity } from "../entities/PlayerEntity";
import { Scene } from "phaser";
import { GameHud } from "../huds/GameHud";
import { PlayerStats } from "../../domain/Player";
import { MonsterEntity } from "../entities/MonsterEntity";

const DEFAULT_SERVER_URL = "/";
// @ts-ignore
const SERVER_URL = import.meta.env.DEV ? DEFAULT_SERVER_URL : ""

export class SocketManager {
  private socket: Socket;
  private gameStateHandler: GameStateHandler;
  private playerDisconnectedHandler: PlayerDisconnectedHandler;

  constructor(
    private readonly scene: Scene,
    private readonly players: Record<string, PlayerEntity>,
    private readonly monsters: Record<string, MonsterEntity>,
    private readonly playerName: string,
    private readonly gameHud: GameHud,
  ) {
    this.socket = io(SERVER_URL, {
      query: {
        name: this.playerName
      }
    });
    this.socket.on("connect", () => {
      this.gameHud.setPlayerId(this.socket.id!);
      this.gameHud.onStatUpdate = (stats: PlayerStats) => {
        this.notifyPlayerStatsUpdate(stats);
      }
      this.gameStateHandler = new GameStateHandler(this, this.scene, this.players, this.monsters, this.gameHud);
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
      const player = this.players[this.socket.id];
      if (player) {
        player.setClientTargetPosition(position);
        this.socket.emit(PLAYER_MOVE_MESSAGE, position)
      }
    }
  }

  public notifyPlayerAttack(id: string) {
    if (this.socket.connected) {
      if (this.players[id].getState() !== "attack")
        this.socket.emit(PLAYER_ATTACK_MESSAGE, id);
    }
  }

  public notifyPlayerCancel() {
    if (this.socket.connected) {
      this.socket.emit(PLAYER_CANCEL_MESSAGE);
    }
  }

  public notifyPlayerStatsUpdate(stats: PlayerStats) {
    if (this.socket.connected) {
      this.socket.emit(PLAYER_STATS_UPDATE_MESSAGE, stats);
    }
  }

  public notifyPlayerKeysMove(keys: { left: boolean, right: boolean, up: boolean, down: boolean }) {
    if (this.socket.connected && this.socket.id) {
      const player = this.players[this.socket.id];
      if (player) {
        const dx = keys.right ? 6 : keys.left ? -6 : 0;
        const dy = keys.down ? 6 : keys.up ? -6 : 0;
        if (dx === 0 && dy === 0) return;
        player.setClientTargetPosition({
          x: player.getPlayerState().position.x + dx,
          y: player.getPlayerState().position.y + dy
        })
        this.socket.emit(PLAYER_KEYS_MOVE_MESSAGE, keys);
      }

    }
  }

  public disconnect() {
    this.socket.disconnect();
  }
}
