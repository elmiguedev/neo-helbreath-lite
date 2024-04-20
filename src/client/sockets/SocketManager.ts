import io, { Socket } from "socket.io-client";

export class SocketManager {
  private socket: Socket;
  constructor() {
    console.log("EL SERVER", import.meta.env.VITE_SERVER_URL)
    this.socket = io(import.meta.env.VITE_SERVER_URL);
  }
}