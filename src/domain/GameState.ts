import { MonsterEntity } from "../server/core/entities/MonsterEntity";
import { PlayerEntity } from "../server/core/entities/PlayerEntity";

export interface GameState {
  players: Record<string, PlayerEntity>;
  monsters: Record<string, MonsterEntity>;
}