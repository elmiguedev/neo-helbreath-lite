import { Position } from "./Poisition";

export type PlayerState = 'walk' | 'idle' | 'attack' | 'hurt' | 'dead' | 'absorb';

export interface PlayerStats {
  vitality: number;
  dextery: number;
  strength: number;
}

export interface PlayerControl {
  hpCoolDown: number;
}

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
  stats: PlayerStats;
  score: number;
  level: number;
  experience: number;
  nextLevelExperience: number;
  armorClass: number;
  availablePoints: number;
  hpCoolDown: number;
  control: PlayerControl
}