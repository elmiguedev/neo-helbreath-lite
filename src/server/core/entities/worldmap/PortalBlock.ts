import { Position } from "../Poisition";
import { Size } from "../Size";

export interface PortalBlock {
  worldMapId: string;
  position: Position;
  size: Size;
  target: PortalBlockTarget;
}

export interface PortalBlockTarget {
  worldMapId: string;
  position: Position;
}

