import { Player, PlayerState, PlayerStats } from "../../../domain/Player";
import { Position } from "../../../domain/Position";
import { EXPERIENCE_TABLE, PLAYER_ATTACK_COOL_DOWN, PLAYER_ATTACK_DISTANCE, PLAYER_BASE_HP, PLAYER_HURT_COOL_DOWN, PLAYER_MAX_SPEED } from "../utils/Constants";
import { Utils } from "../utils/Utils";

export class PlayerEntity {
  public playerState: Player;

  constructor(playerState: Player) {
    this.playerState = playerState
  }

  public setTargetPosition(position?: Position) {
    this.playerState.hasEnemiTarget = false;
    this.playerState.targetPosition = position
  }

  public setTargetPositionWithEnemyTarget(position: Position) {
    this.playerState.hasEnemiTarget = true;
    this.playerState.targetPosition = position
  }

  public clearTargetPosition() {
    this.playerState.targetPosition = undefined
  }

  public setPosition(position: Position) {
    this.playerState.position = position
  }

  public setAttackMode() { // PONER SOLO EN EL SETSTATE
    this.setState("attack");
    setTimeout(() => {
      this.setState("idle");
    }, PLAYER_ATTACK_COOL_DOWN);
  }

  public setHurtMode() { // PONER SOLO EN EL SET STATE
    this.setState("hurt");
    setTimeout(() => { this.setState("idle") }, PLAYER_HURT_COOL_DOWN);
  }

  public getDamage() {
    return Utils.throwDice(2, 8) + this.playerState.stats.strength
  }

  public hurt(damage: number) {
    this.playerState.hp -= damage;
    if (this.playerState.hp > 0) {
      this.setHurtMode();
    } else {
      this.setState("dead");
    }
  }

  public getPosition() {
    return this.playerState.position
  }

  public getArmorClass() {
    return this.playerState.armorClass;
  }

  public canMove() {
    return !!this.playerState.targetPosition &&
      (this.playerState.state === "walk" || this.playerState.state === "idle")
  }

  public isDead() {
    return this.playerState.state === "dead"
  }

  public canAttack() {
    return this.playerState.state !== "attack" &&
      this.playerState.state !== "absorb" &&
      this.playerState.state !== "dead"
  }

  public canHit(armorClass: number) {
    const hitRoll = Utils.throwDice(1, 20);
    return hitRoll + this.playerState.stats.dextery >= armorClass
  }

  public isInAttackRange(position: Position) {
    const distance = Utils.distanceBetween(
      this.getPosition(),
      position
    );
    return distance <= PLAYER_ATTACK_DISTANCE;
  }

  public setState(state: PlayerState) {
    this.playerState.state = state
  }

  public increaseScore(score: number) {
    this.playerState.score += score
  }

  public updatePosition() {
    if (!this.playerState.targetPosition) return;

    const position = Utils.constantLerpPosition(
      this.playerState.position.x,
      this.playerState.position.y,
      this.playerState.targetPosition!.x,
      this.playerState.targetPosition!.y,
      PLAYER_MAX_SPEED
    );

    this.setPosition(position);

    const targetDistance = Utils.distanceBetweenPoints(
      position.x,
      position.y,
      this.playerState.targetPosition.x,
      this.playerState.targetPosition.y
    );

    if (targetDistance < this.getTargetValidationDistance()) {
      this.setPosition(position);
      this.clearTargetPosition();
    }
  }

  public isInBounds(minX: number, maxX: number, minY: number, maxY: number) {
    return this.playerState.position.y >= -minY &&
      this.playerState.position.y <= maxY &&
      this.playerState.position.x >= -minX &&
      this.playerState.position.x <= maxX
  }

  public getExperience() {
    return this.playerState.experience;
  }

  public increaseExperience(value: number) {
    this.playerState.experience += value;
    this.validateNewLevel();
  }

  public canUpdateStats() {
    return this.playerState.availablePoints > 0;
  }

  public getAvailablePoints() {
    return this.playerState.availablePoints;
  }

  public updateStats(stats: PlayerStats) {
    this.playerState.stats.dextery += stats.dextery;
    this.playerState.stats.strength += stats.strength;
    this.playerState.stats.vitality += stats.vitality;
    this.playerState.availablePoints -= stats.dextery + stats.strength + stats.vitality;

    this.playerState.maxHp = PLAYER_BASE_HP
      + (this.playerState.stats.vitality * 6);

  }

  public updateHp() {
    this.playerState.control.hpCoolDown++;
    if (this.playerState.control.hpCoolDown > this.playerState.hpCoolDown) {
      this.playerState.control.hpCoolDown = 0;
      this.recoverHp();
    }
  }

  private getTargetValidationDistance() {
    return this.playerState.hasEnemiTarget
      ? PLAYER_ATTACK_DISTANCE
      : PLAYER_MAX_SPEED
  }

  private validateNewLevel() {
    if (this.playerState.experience >= this.playerState.nextLevelExperience) {
      this.playerState.level += 1;
      this.playerState.nextLevelExperience = EXPERIENCE_TABLE[this.playerState.level + 1];
      this.playerState.availablePoints += 1;
      this.playerState.hp += Math.floor(this.playerState.hp / 2);
      this.validateNewLevel();
    }
  }

  private increaseHp(value: number) {
    this.playerState.hp += value;
    if (this.playerState.hp > this.playerState.maxHp) {
      this.playerState.hp = this.playerState.maxHp
    }
  }

  private recoverHp() {
    this.increaseHp(
      2 + (this.playerState.stats.vitality * 5)
    )
  }

}