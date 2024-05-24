import express from "express";
import http from "http";
import { Socket, Server as SocketServer } from "socket.io";
import path from "path";
import { CreatePlayerAction } from "./core/actions/CreatePlayerAction";
import { RemovePlayerAction } from "./core/actions/RemovePlayerAction";
import {
  PLAYER_ATTACK_MONSTER_MESSAGE,
  PLAYER_CANCEL_MESSAGE,
  PLAYER_DISCONNECTED_MESSAGE,
  PLAYER_KEYS_MOVE_MESSAGE,
  PLAYER_MOVE_MESSAGE,
  PLAYER_STATS_UPDATE_MESSAGE
} from "./delivery/Messages";
import { PlayerMoveAction } from "./core/actions/PlayerMoveAction";
import { PlayerAttackMonsterAction } from "./core/actions/PlayerAttackMonsterAction";
import { PlayerCancelAction } from "./core/actions/PlayerCancelAction";
import { PlayerStatUpdateAction } from "./core/actions/PlayerStatUpdateAction";
import { PlayerMoveKeysAction } from "./core/actions/PlayerMoveKeysAction";
import { Game } from "./core/Game";
import { GameStateNotifier } from "./delivery/notifiers/GameStateNotifier";
import { Position } from "./core/entities/Poisition";
import { PlayerAttributes } from "./core/entities/player/PlayerAttributes";
import { CreateWorldMapsAction } from "./core/actions/CreateWorldMapsAction";

const port = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);
const socketServer = new SocketServer(server, {
  cors: {
    origin: ["https://localhost:3001", "http://localhost:3001"],
    methods: ["GET", "POST"]
  }
});


const game = new Game();

const createWorldMapsAction = new CreateWorldMapsAction(game);
const createPlayerAction = new CreatePlayerAction(game);
const playerAttackMonsterAction = new PlayerAttackMonsterAction(game);
const removePlayerAction = new RemovePlayerAction(game);
const playerMoveAction = new PlayerMoveAction(game);
const playerCancelAction = new PlayerCancelAction(game);
const playerMoveKeysAction = new PlayerMoveKeysAction(game);
const playerStatUpdateAction = new PlayerStatUpdateAction(game);

// const gameStateEvent = new GameStateEvent(gameState);
createWorldMapsAction.execute();

const gameStateNotifier = new GameStateNotifier(socketServer);
game.addGameStateListener(gameStateNotifier);

// creamos la conexion por socket
socketServer.on("connection", (socket: Socket) => {
  createPlayerAction.execute({
    id: socket.id,
    name: socket.handshake.query.name as string || "Player"
  });
  socket.on("disconnect", () => {
    removePlayerAction.execute({ id: socket.id });
    socketServer.emit(PLAYER_DISCONNECTED_MESSAGE, socket.id);
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

game.startLoop();


// creamos endpoints de api
app.get("/ping", (req, res) => {
  res.send("pong");
})

app.use(express.static(path.join(__dirname, "../public")));

// ejecutamos el server
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
})