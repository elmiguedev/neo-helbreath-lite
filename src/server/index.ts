import express from "express";
import http from "http";
import { Socket, Server as SocketServer } from "socket.io";
import path from "path";

const port = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);
const socketServer = new SocketServer(server, {
  cors: {
    origin: ["https://localhost:3001","http://localhost:3001"],
    methods: ["GET", "POST"]  
  }
});

socketServer.on("connection", (socket: Socket) => {
  console.log("a user connected");
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

app.get("/ping", (req, res) => {
  res.send("pong");
})

app.use(express.static(path.join(__dirname, "public")));

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
})