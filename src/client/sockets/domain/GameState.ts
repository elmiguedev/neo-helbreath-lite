import { PlayerGameState } from "./player/PlayerGameState"

export interface GameState {
  players: Record<string, PlayerGameState>
  // monsters: Record<string, MonsterGame>
}