import { Position } from "./Position";
import { Player } from "./Player";

export type MonsterType = "chobi"

export interface Monster {
  id: string;
  name: string;
  hp: number;
  maxHp: number;
  position: Position;
  targetPosition?: Position;
  targetPlayer?: Player;
  state: 'idle' | 'walk' | 'attack' | 'hurt' | 'dead';
  minExperience: number;
  maxExperience: number;
  attackDieCount: number;
  attackDieSides: number;
  ca: number;
  type: MonsterType;
}