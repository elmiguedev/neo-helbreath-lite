import io, { Socket } from "socket.io-client";

const DEFAULT_SERVER_URL = "http://localhost:3000";
const SERVER_URL = import.meta.env.DEV ? DEFAULT_SERVER_URL : ""

export class SocketManager {
  private socket: Socket;
  constructor() {
    this.socket = io(SERVER_URL);
  }
}