import { Position } from "../Poisition";
import { Size } from "../Size";
import { PlayerAttributes } from "./PlayerAttributes";
import { PlayerControlParams } from "./PlayerControlParams";
import { PlayerSkills } from "./PlayerSkills";
import { PlayerState } from "./PlayerState";
import { PlayerStats } from "./PlayerStats";

export interface PlayerGameState {
  id: string;
  name: string;
  worldMapId: string;
  bounds: Size;
  attributes: PlayerAttributes;
  stats: PlayerStats;
  position: Position;
  targetPosition?: Position;
  state: PlayerState;
  skills: PlayerSkills;
}