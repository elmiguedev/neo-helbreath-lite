import { Position } from "../Poisition";
import { PlayerAttributes } from "./PlayerAttributes";
import { PlayerControlParams } from "./PlayerControlParams";
import { PlayerState } from "./PlayerState";

export interface PlayerGameState {
  id: string;
  name: string;
  color: number;
  hp: number;
  maxHp: number;
  position: Position;
  targetPosition?: Position;
  hasEnemiTarget: boolean;
  state: PlayerState;
  stats: PlayerAttributes;
  score: number;
  level: number;
  experience: number;
  nextLevelExperience: number;
  armorClass: number;
  availablePoints: number;
  hpCoolDown: number;
  control: PlayerControlParams;
}