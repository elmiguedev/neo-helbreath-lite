import { Scene } from "phaser";
import { SocketManager } from "../sockets/SocketManager";

export class StartScene extends Scene {
  private socketManager: SocketManager;

  constructor() {
    super("StartScene");
  }

  create() {
    this.add.text(0, 0, "Hola paaaaa!").setOrigin(0);
    this.createSocketManager();
  }

  createSocketManager() {
    this.socketManager = new SocketManager();
  }
}