import { Server } from "socket.io";
import { GameState } from "../../core/GameState";
import { GameStateListener } from "../../core/GameStateListener";
import { GAME_STATE_MESSAGE } from "../Messages";

export class GameStateNotifier implements GameStateListener {

  constructor(
    private readonly serverSocket: Server
  ) { }

  notify(gameState: GameState): void {
    // this.serverSocket.emit(GAME_STATE_MESSAGE, gameState);
    this.serverSocket
      .in(gameState.worldMapId)
      .emit(GAME_STATE_MESSAGE, gameState);
  }

}