import { Position } from "../Poisition";
import { Size } from "../Size";
import { PlayerGameState } from "../player/PlayerGameState";
import { MonsterState } from "./MonsterState";
import { MonsterStats } from "./MonsterStats";
import { MonsterType } from "./MonsterType";

export interface MonsterGameState {
  id: string;
  worldMapId: string;
  type: MonsterType;
  position: Position;
  targetPosition?: Position;
  targetPlayer?: PlayerGameState;
  bounds: Size;
  stats: MonsterStats;
  state: MonsterState;
}