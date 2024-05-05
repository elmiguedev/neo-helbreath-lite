import { Position } from "./Position";

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
  tickNumber: number;

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
  stats: PlayerStats;
  level: number;
  experience: number;
  nextLevelExperience: number;
  armorClass: number;
  availablePoints: number;
  hpCoolDown: number;
  control: PlayerControl
}