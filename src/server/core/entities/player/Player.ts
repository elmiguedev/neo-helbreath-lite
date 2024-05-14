import { EXPERIENCE_TABLE, PLAYER_ATTACK_COOL_DOWN, PLAYER_ATTACK_DISTANCE, PLAYER_BASE_ARMOR_CLASS, PLAYER_BASE_HP, PLAYER_EK_SCORE, PLAYER_HIT_SCORE, PLAYER_HP_COOLDOWN, PLAYER_HURT_COOL_DOWN, PLAYER_MAX_SPEED, WORLD_RADIUS } from "../../utils/Constants";
import { Utils } from "../../utils/Utils";
import { Entity } from "../Entity";
import { Position } from "../Poisition";
import { PlayerAttributes } from "./PlayerAttributes";
import { PlayerControlParams } from "./PlayerControlParams";
import { PlayerGameState } from "./PlayerGameState";
import { PlayerState } from "./PlayerState";
import { PlayerStats } from "./PlayerStats";

export interface PlayerProps {
  id: string;
  name: string;
  color: number;
}

export class Player implements Entity {
  public id: string;
  public position: Position;
  private name: string;
  private color: number;
  private stats: PlayerStats;
  private attributes: PlayerAttributes;
  private controlParams: PlayerControlParams;
  private targetPosition?: Position;
  private state: PlayerState;

  constructor(props: PlayerProps) {
    this.id = props.id;
    this.name = props.name;
    this.color = props.color;
    this.attributes = {
      dextery: 1,
      strength: 1,
      vitality: 1
    };
    this.controlParams = {
      hpCoolDown: 0,
      hasEnemiTarget: false
    };
    this.stats = {
      maxHp: 100,
      hp: 100,
      score: 0,
      level: 1,
      experience: EXPERIENCE_TABLE[1],
      nextLevelExperience: EXPERIENCE_TABLE[2],
      armorClass: PLAYER_BASE_ARMOR_CLASS,
      availablePoints: 0,
      hpCoolDown: PLAYER_HP_COOLDOWN,
    };
    this.position = {
      x: 0,
      y: 0
    };
    this.state = 'idle';


  }

  public update() {
    this.updatePosition();
    this.updateHp();
  }

  public getGamePlayerState(): PlayerGameState {
    return {
      id: this.id,
      name: this.name,
      color: this.color,
      hp: this.stats.hp,
      maxHp: this.stats.maxHp,
      position: this.position,
      targetPosition: this.targetPosition,
      hasEnemiTarget: this.controlParams.hasEnemiTarget,
      state: this.state,
      stats: this.attributes,
      score: this.stats.score,
      level: this.stats.level,
      experience: this.stats.experience,
      nextLevelExperience: this.stats.nextLevelExperience,
      armorClass: this.stats.armorClass,
      availablePoints: this.stats.availablePoints,
      hpCoolDown: this.controlParams.hpCoolDown,
      control: this.controlParams
    }
  }

  // public methods
  // ---------------------------------------

  public attackPlayer(enemy: Player) {
    if (!this.canAttack() || enemy.isDead()) return;

    if (this.isInAttackRange(enemy.position)) {
      this.setAttackMode();
      if (this.canHit(enemy.stats.armorClass)) {
        const damage = this.getDamage();
        enemy.hurt(damage);
        this.increaseScore(PLAYER_HIT_SCORE);
        if (enemy.isDead()) {
          this.increaseScore(PLAYER_EK_SCORE);
          this.increaseExperience(enemy.stats.experience)
        }
      }
    }
    else {
      this.followPlayer(enemy);
    }
  }

  public canAttack(): boolean {
    return this.state !== "attack" &&
      this.state !== "absorb" &&
      this.state !== "dead";
  }

  public isDead(): boolean {
    return this.state === "dead";
  }

  public hurt(damage: number) {
    this.stats.hp -= damage;
    if (this.stats.hp > 0) {
      this.setHurtMode();
    } else {
      this.kill();
    }
  }

  public setTargetPosition(position: Position) {
    this.targetPosition = position;
  }

  public stopMovement() {
    if (!this.isDead()) {
      this.state = "idle";
      this.targetPosition = undefined;
    }
  }

  public updateAttributes(attributes: PlayerAttributes) {
    const totalPoints = this.getTotalPoints(attributes);
    if (totalPoints === 0) return;
    if (totalPoints > this.stats.availablePoints) return;

    this.attributes.dextery += attributes.dextery;
    this.attributes.strength += attributes.strength;
    this.attributes.vitality += attributes.vitality;
    this.stats.availablePoints -= totalPoints;

    this.recalculateStats();
  }

  public updatePosition() {
    if (!this.canMove()) return;
    this.state = "walk"
    this.advancePosition();
    this.validateWorldBounds();
  }

  public updateHp() {
    this.controlParams.hpCoolDown++;
    if (this.controlParams.hpCoolDown > this.stats.hpCoolDown) {
      this.controlParams.hpCoolDown = 0;
      this.recoverHp();
    }
  }

  // private methods
  // ---------------------------------------

  private isInAttackRange(position: Position): boolean {
    const distance = Utils.distanceBetween(
      this.position,
      position
    );
    return distance <= PLAYER_ATTACK_DISTANCE;
  }

  private setAttackMode() {
    this.state = "attack";
    setTimeout(() => {
      this.state = "idle"
    }, PLAYER_ATTACK_COOL_DOWN);
  }

  private setHurtMode() {
    this.state = "hurt";
    setTimeout(() => {
      this.state = "idle"
    }, PLAYER_HURT_COOL_DOWN);
  }

  private canHit(armorClass: number) {
    const hitRoll = Utils.throwDice(1, 20);
    return hitRoll + this.attributes.dextery >= armorClass
  }

  private getDamage() {
    return Utils.throwDice(2, 8) + this.attributes.strength
  }

  private kill() {
    this.state = "dead";
  }

  private increaseScore(score: number) {
    this.stats.score += score
  }

  private increaseExperience(value: number) {
    this.stats.experience += value;
    this.validateNewLevel();
  }

  private validateNewLevel() {
    if (this.stats.experience >= this.stats.nextLevelExperience) {
      this.stats.level += 1;
      this.stats.nextLevelExperience = EXPERIENCE_TABLE[this.stats.level + 1];
      this.stats.availablePoints += 1;
      this.stats.hp += Math.floor(this.stats.hp / 2);
      this.validateNewLevel();
    }
  }

  private followPlayer(enemy: Player) {
    this.targetPosition = enemy.position;
    this.controlParams.hasEnemiTarget = true;
  }

  private getTotalPoints(attributes: PlayerAttributes) {
    return Object.values(attributes).reduce((a, b) => a + b, 0);
  }

  private recalculateStats() {
    this.stats.maxHp = PLAYER_BASE_HP
      + (this.attributes.vitality * 6);
  }

  private canMove(): boolean {
    return !!this.targetPosition &&
      (this.state === "walk" || this.state === "idle")
  }

  private advancePosition() {
    if (!this.targetPosition) return;

    this.position = Utils.moveTowardsTarget(
      this.position.x,
      this.position.y,
      this.targetPosition.x,
      this.targetPosition.y,
      PLAYER_MAX_SPEED
    );

    const targetDistance = Utils.distanceBetweenPoints(
      this.position.x,
      this.position.y,
      this.targetPosition.x,
      this.targetPosition.y
    );

    if (targetDistance < this.getTargetValidationDistance()) {
      this.targetPosition = undefined
      this.state = 'idle';
    }
  }

  private getTargetValidationDistance() {
    return this.controlParams.hasEnemiTarget
      ? PLAYER_ATTACK_DISTANCE
      : PLAYER_MAX_SPEED
  }

  private validateWorldBounds() {
    if (this.position.y <= -WORLD_RADIUS)
      this.position = { x: this.position.x, y: -WORLD_RADIUS };
    if (this.position.x <= -WORLD_RADIUS)
      this.position = { x: -WORLD_RADIUS, y: this.position.y };
    if (this.position.y >= WORLD_RADIUS)
      this.position = { x: this.position.x, y: WORLD_RADIUS };
    if (this.position.x >= WORLD_RADIUS)
      this.position = { x: WORLD_RADIUS, y: this.position.y };
  }

  private increaseHp(value: number) {
    this.stats.hp += value;
    if (this.stats.hp > this.stats.maxHp) {
      this.stats.hp = this.stats.maxHp
    }
  }

  private recoverHp() {
    this.increaseHp(
      2 + (this.attributes.vitality * 5)
    )
  }
}