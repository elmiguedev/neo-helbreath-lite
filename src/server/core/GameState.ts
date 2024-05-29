import { MonsterGameState } from "./entities/monster/MonsterGameState";
import { PlayerGameState } from "./entities/player/PlayerGameState";

export interface GameState {
  worldMapId: string;
  players: Record<string, PlayerGameState>,
  monsters: Record<string, MonsterGameState>,
}