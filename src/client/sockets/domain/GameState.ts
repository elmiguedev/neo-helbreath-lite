import { Monster } from "../../../domain/Monster";
import { Player } from "../../../domain/Player";

export interface GameState {
  players: Record<string, Player>
  monsters: Record<string, Monster>
}