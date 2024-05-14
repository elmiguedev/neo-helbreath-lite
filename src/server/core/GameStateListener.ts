import { GameState } from "./GameState";

export interface GameStateListener {
  notify(gameState: GameState): void
} 