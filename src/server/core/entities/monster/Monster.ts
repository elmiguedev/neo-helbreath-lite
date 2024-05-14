import { Entity } from "../Entity";
import { Position } from "../Poisition";
import { Player } from "../player/Player";
import { MonsterGameState } from "./MonsterGameState";
import { MonsterState } from "./MonsterState";
import { MonsterStats } from "./MonsterStats";
import { MonsterType } from "./MonsterType";

export class Monster implements Entity {
  public id: string;
  private type: MonsterType;
  private position: Position;
  private targetPosition?: Position;
  private targetPlayer?: Player;
  private state: MonsterState;
  private stats: MonsterStats;


  constructor(id: string, type: MonsterType, position: Position) {
    this.id = id;
    this.type = type;
    this.position = position;
    this.targetPosition = undefined;
    this.targetPlayer = undefined;
    this.state = 'idle';
    this.stats = {
      maxHp: 20,
      hp: 20,
      ca: 5,
      maxExperience: 300,
      minExperience: 100,
      attackDieCount: 1,
      attackDieSides: 8,
    };
  }

  public update(): void {

  }

  public getMonsterGameState(): MonsterGameState {
    return {
      id: this.id,
      name: this.type,
      hp: this.stats.hp,
      maxHp: this.stats.maxHp,
      position: this.position,
      targetPosition: this.targetPosition,
      targetPlayer: this.targetPlayer?.getGamePlayerState(),
      state: this.state,
      minExperience: this.stats.minExperience,
      maxExperience: this.stats.maxExperience,
      attackDieCount: this.stats.attackDieCount,
      attackDieSides: this.stats.attackDieSides,
      ca: this.stats.ca,
      type: this.type
    }
  }
}