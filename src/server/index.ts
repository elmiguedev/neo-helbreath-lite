import express from "express";
import http from "http";
import { Socket, Server as SocketServer } from "socket.io";
import path from "path";

const port = process.env.PORT || 3000;
const clientDir = process.env.CLIENT_DIR || "../client/public";
const app = express();
const server = http.createServer(app);
const socketServer = new SocketServer(server);

socketServer.on("connection", (socket: Socket) => {
  console.log("a user connected");
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

app.get("/ping", (req, res) => {
  res.send("pong");
})

app.use(express.static(path.join(__dirname, clientDir)));

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
})