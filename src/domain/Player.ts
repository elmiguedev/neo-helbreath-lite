import { Position } from "./Position";

export type PlayerState = 'walk' | 'idle' | 'attack' | 'hurt' | 'dead' | 'absorb';

export interface Player {
  id: string;
  name: string;
  color: number;
  hp: number;
  maxHp: number;
  position: Position;
  targetPosition?: Position;
  hasEnemiTarget: boolean;
  state: PlayerState;
  score: number;
  vitality: number;
  dextery: number;
  strength: number;
  level: number;
  experience: number;
  nextLevelExperience: number;
  armorClass: number;
}