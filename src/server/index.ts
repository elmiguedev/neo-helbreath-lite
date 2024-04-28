import express from "express";
import http from "http";
import { Socket, Server as SocketServer } from "socket.io";
import path from "path";
import { CreatePlayerAction } from "./core/actions/CreatePlayerAction";
import { GameStateEvent } from "./core/events/GameStateEvent";
import { RemovePlayerAction } from "./core/actions/RemovePlayerAction";
import { GameState } from "../domain/GameState";
import { GAME_STATE_MESSAGE, PLAYER_ATTACK_MESSAGE, PLAYER_DISCONNECTED_MESSAGE, PLAYER_MOVE_MESSAGE } from "../domain/Messages";
import { PlayerMoveAction } from "./core/actions/PlayerMoveAction";
import { Position } from "../domain/Position";
import { UpdatePlayersAction } from "./core/actions/UpdatePlayersAction";
import { PlayerAttackAction, PlayerAttackActionParams } from "./core/actions/PlayerAttackAction";

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
  players: {}
}

const createPlayerAction = new CreatePlayerAction(gameState);
const removePlayerAction = new RemovePlayerAction(gameState);
const playerMoveAction = new PlayerMoveAction(gameState);
const updatePlayersAction = new UpdatePlayersAction(gameState);
const playerAttackAction = new PlayerAttackAction(gameState);
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
  })
});

setInterval(() => {
  updatePlayersAction.execute();
  socketServer.emit(GAME_STATE_MESSAGE, gameStateEvent.execute());
}, 1000 / 60);









// creamos endpoints de api
app.get("/ping", (req, res) => {
  res.send("pong");
})

app.use(express.static(path.join(__dirname, "public")));

// ejecutamos el server
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
})