import express from "express";
import http from "http";
import { Socket, Server as SocketServer } from "socket.io";
import path from "path";
import { CreatePlayerAction } from "./core/actions/CreatePlayerAction";
import { GameStateEvent } from "./core/events/GameStateEvent";
import { RemovePlayerAction } from "./core/actions/RemovePlayerAction";
import { GameState } from "../domain/GameState";
import { GAME_STATE_MESSAGE, PLAYER_ATTACK_MESSAGE, PLAYER_CANCEL_MESSAGE, PLAYER_DISCONNECTED_MESSAGE, PLAYER_KEYS_MOVE_MESSAGE, PLAYER_MOVE_MESSAGE, PLAYER_STATS_UPDATE_MESSAGE } from "../domain/Messages";
import { PlayerMoveAction } from "./core/actions/PlayerMoveAction";
import { Position } from "../domain/Position";
import { UpdatePlayersAction } from "./core/actions/UpdatePlayersAction";
import { PlayerAttackAction, PlayerAttackActionParams } from "./core/actions/PlayerAttackAction";
import { PlayerCancelAction } from "./core/actions/PlayerCancelAction";
import { PlayerStatUpdateAction } from "./core/actions/PlayerStatUpdateAction";
import { PlayerStats } from "../domain/Player";
import { PlayerMoveKeysAction } from "./core/actions/PlayerMoveKeysAction";
import { MonsterEntity } from "./core/entities/MonsterEntity";

const port = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);
const socketServer = new SocketServer(server, {
  cors: {
    origin: ["https://localhost:3001", "http://localhost:3001"],
    methods: ["GET", "POST"]
  }
});


// creamos las dependencias del servidor
const gameState: GameState = {
  players: {},
  monsters: {
    "chobi": new MonsterEntity({
      attackDieCount: 1,
      attackDieSides: 8,
      ca: 5,
      hp: 20,
      id: "chobi",
      maxExperience: 300,
      minExperience: 100,
      maxHp: 20,
      name: "Chobi",
      position: { x: 225, y: 225 },
      state: "idle",
      type: "chobi"
    })
  }
}

const createPlayerAction = new CreatePlayerAction(gameState);
const removePlayerAction = new RemovePlayerAction(gameState);
const playerMoveAction = new PlayerMoveAction(gameState);
const updatePlayersAction = new UpdatePlayersAction(gameState);
const playerAttackAction = new PlayerAttackAction(gameState);
const playerCancelAction = new PlayerCancelAction(gameState);
const playerStatUpdateAction = new PlayerStatUpdateAction(gameState);
const playerMoveKeysAction = new PlayerMoveKeysAction(gameState);

const gameStateEvent = new GameStateEvent(gameState);

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

  socket.on(PLAYER_ATTACK_MESSAGE, (id: string) => {
    playerAttackAction.execute({
      playerId: socket.id,
      enemyId: id
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

  socket.on(PLAYER_STATS_UPDATE_MESSAGE, (stats: PlayerStats) => {
    playerStatUpdateAction.execute({
      playerId: socket.id,
      stats
    });
  });

});

setInterval(() => {
  updatePlayersAction.execute();
  socketServer.emit(GAME_STATE_MESSAGE, gameStateEvent.execute());
}, 1000 / 60);









// creamos endpoints de api
app.get("/ping", (req, res) => {
  res.send("pong");
})

app.use(express.static(path.join(__dirname, "../public")));

// ejecutamos el server
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
})