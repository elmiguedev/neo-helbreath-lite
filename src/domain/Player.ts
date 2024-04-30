import { Position } from "./Position";

export interface Player {
  id: string;
  name: string;
  color: number;
  hp: number;
  maxHp: number;
  position: Position;
  targetPosition?: Position;
  state: 'idle' | 'walk' | 'attack' | 'hurt' | 'dead' | 'absorb';
  score: number;
}