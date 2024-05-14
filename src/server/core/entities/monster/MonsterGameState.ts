import { Position } from "../Poisition";
import { PlayerGameState } from "../player/PlayerGameState";
import { MonsterState } from "./MonsterState";
import { MonsterType } from "./MonsterType";

export interface MonsterGameState {
  id: string;
  name: string;
  hp: number;
  maxHp: number;
  position: Position;
  targetPosition?: Position;
  targetPlayer?: PlayerGameState;
  state: MonsterState;
  minExperience: number;
  maxExperience: number;
  attackDieCount: number;
  attackDieSides: number;
  ca: number;
  type: MonsterType;
}