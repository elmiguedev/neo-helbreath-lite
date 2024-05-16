import { PLAYER_BASE_TILESIZE, PLAYER_HURT_COOL_DOWN } from "../../utils/Constants";
import { Utils } from "../../utils/Utils";
import { Entity } from "../Entity";
import { Position } from "../Poisition";
import { Size } from "../Size";
import { Player } from "../player/Player";
import { MonsterGameState } from "./MonsterGameState";
import { MonsterState } from "./MonsterState";
import { MonsterStats } from "./MonsterStats";
import { MonsterType } from "./MonsterType";

export interface MonsterProps {
  id: string;
  type: MonsterType;
  position: Position;
  worldMapId: string;
  stats: MonsterStats;
  bounds?: Size;
}

export class Monster implements Entity {
  public id: string;
  public worldMapId: string;
  public type: MonsterType;
  public position: Position;
  public targetPosition?: Position;
  public targetPlayer?: Player;
  public state: MonsterState;
  public stats: MonsterStats;
  public bounds: Size;


  constructor(props: MonsterProps) {
    this.id = props.id;
    this.worldMapId = props.worldMapId;
    this.type = props.type;

    this.position = props.position;
    this.targetPosition = undefined;
    this.targetPlayer = undefined;
    this.stats = props.stats;
    this.state = 'idle';
    this.bounds = props.bounds || {
      width: PLAYER_BASE_TILESIZE,
      height: PLAYER_BASE_TILESIZE
    };
  }

  public update(): void {

  }

  public isDead(): boolean {
    return this.state === "dead";
  }

  public getMonsterGameState(): MonsterGameState {
    return {
      id: this.id,
      worldMapId: this.worldMapId,
      type: this.type,
      position: this.position,
      targetPosition: this.targetPosition,
      targetPlayer: this.targetPlayer?.getGamePlayerState(),
      bounds: this.bounds,
      stats: this.stats,
      state: this.state,
    }
  }

  public hurt(damage: number) {
    this.stats.health -= damage;
    if (this.stats.health > 0) {
      this.setHurtMode();
    } else {
      this.kill();
    }
  }

  public getExperience() {
    return Utils.getIntegerBetween(
      this.stats.minExperience,
      this.stats.maxExperience
    )
  }

  private setHurtMode() {
    this.state = "hurt";
    setTimeout(() => {
      this.state = "idle"
    }, PLAYER_HURT_COOL_DOWN);
  }

  private kill() {
    this.state = "dead";
  }
}