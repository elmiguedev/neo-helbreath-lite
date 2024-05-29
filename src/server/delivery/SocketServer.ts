import http from "http";
import { Socket, Server } from "socket.io";
import path from "path";
import { Express } from "express";
import { Game } from "../core/Game";
import { CreateWorldMapsAction } from "../core/actions/CreateWorldMapsAction";
import { CreatePlayerAction } from "../core/actions/CreatePlayerAction";
import { PlayerAttackMonsterAction } from "../core/actions/PlayerAttackMonsterAction";
import { RemovePlayerAction } from "../core/actions/RemovePlayerAction";
import { PlayerMoveAction } from "../core/actions/PlayerMoveAction";
import { PlayerCancelAction } from "../core/actions/PlayerCancelAction";
import { PlayerMoveKeysAction } from "../core/actions/PlayerMoveKeysAction";
import { PlayerStatUpdateAction } from "../core/actions/PlayerStatUpdateAction";
import { GameStateNotifier } from "./notifiers/GameStateNotifier";
import { PLAYER_ATTACK_MONSTER_MESSAGE, PLAYER_CANCEL_MESSAGE, PLAYER_DISCONNECTED_MESSAGE, PLAYER_KEYS_MOVE_MESSAGE, PLAYER_MOVE_MESSAGE, PLAYER_STATS_UPDATE_MESSAGE } from "./Messages";
import { Position } from "../core/entities/Poisition";
import { PlayerAttributes } from "../core/entities/player/PlayerAttributes";
import { MapAddPlayerNotifier } from "./notifiers/MapAddPlayerNotifier";

export class SocketServer {
  private socketServer: Server;
  private httpServer: http.Server;
  private game: Game;
  private sockets: Record<string, Socket> = {};

  constructor(app: Express, game: Game) {
    this.game = game;
    this.httpServer = http.createServer(app);
    this.socketServer = new Server(this.httpServer, {
      cors: {
        origin: ["https://localhost:3001", "http://localhost:3001"],
        methods: ["GET", "POST"]
      }
    });

    const createWorldMapsAction = new CreateWorldMapsAction(game);
    const createPlayerAction = new CreatePlayerAction(game);
    const playerAttackMonsterAction = new PlayerAttackMonsterAction(game);
    const removePlayerAction = new RemovePlayerAction(game);
    const playerMoveAction = new PlayerMoveAction(game);
    const playerCancelAction = new PlayerCancelAction(game);
    const playerMoveKeysAction = new PlayerMoveKeysAction(game);
    const playerStatUpdateAction = new PlayerStatUpdateAction(game);

    createWorldMapsAction.execute(); // ACA TENGO LOS MAPAS

    // 1. creo las salas del socket

    const gameStateNotifier = new GameStateNotifier(this.socketServer);
    const mapAddPlayerNotifier = new MapAddPlayerNotifier(this, game);

    game.addGameStateListener(gameStateNotifier);
    game.addChangeMapListener(mapAddPlayerNotifier);

    this.socketServer.on("connection", (socket: Socket) => {
      this.sockets[socket.id] = socket;

      // aca obtiene el player que hoy lo creamos de una, pero despues los acamos de un repo
      createPlayerAction.execute({
        id: socket.id,
        name: socket.handshake.query.name as string || "Player"
      });

      socket.on("disconnect", () => {
        delete this.sockets[socket.id];
        removePlayerAction.execute({ id: socket.id });
        this.socketServer.emit(PLAYER_DISCONNECTED_MESSAGE, socket.id);
      });

      socket.on(PLAYER_MOVE_MESSAGE, (position: Position) => {
        playerMoveAction.execute({ id: socket.id, position });
      });

      socket.on(PLAYER_ATTACK_MONSTER_MESSAGE, (id: string) => {
        playerAttackMonsterAction.execute({
          playerId: socket.id,
          monsterId: id
        });
      });

      socket.on(PLAYER_CANCEL_MESSAGE, () => {
        playerCancelAction.execute(socket.id);
      });

      socket.on(PLAYER_KEYS_MOVE_MESSAGE, (keys: { left: false, right: false, up: false, down: false }) => {
        playerMoveKeysAction.execute({
          playerId: socket.id,
          keys
        });
      });

      socket.on(PLAYER_STATS_UPDATE_MESSAGE, (attributes: PlayerAttributes) => {
        playerStatUpdateAction.execute({
          playerId: socket.id,
          attributes
        });
      });
    });
  }

  public listen(port: number) {
    this.httpServer.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    })
  }

  public changePlayerRoom(playerId: string, newRoom: string, oldRoom?: string) {
    if (oldRoom) {
      this.sockets[playerId].leave(oldRoom);
      this.socketServer.to(oldRoom).emit(PLAYER_DISCONNECTED_MESSAGE, playerId);
    }
    this.sockets[playerId].join(newRoom);
  }
}