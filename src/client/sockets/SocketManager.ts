import io, { Socket } from "socket.io-client";

export class SocketManager {
  private socket: Socket;
  constructor() {
    this.socket = io("localhost:3000");
  }
}