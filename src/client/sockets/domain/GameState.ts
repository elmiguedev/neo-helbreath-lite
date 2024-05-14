import { Monster } from "./Monster"
import { Player } from "./Player"

export interface GameState {
  players: Record<string, Player>
  monsters: Record<string, Monster>
}