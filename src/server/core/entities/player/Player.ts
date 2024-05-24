import { Game } from "../../Game";
import { PLAYER_EXPERIENCE_ARRAY, PLAYER_ATTACK_COOL_DOWN, PLAYER_ATTACK_DISTANCE, PLAYER_BASE_ARMOR_CLASS, PLAYER_BASE_HP, PLAYER_BASE_TILESIZE, PLAYER_EK_SCORE, PLAYER_HIT_SCORE, PLAYER_HP_COOLDOWN, PLAYER_HURT_COOL_DOWN, PLAYER_MAX_SPEED, WORLD_RADIUS, PLAYER_HIT_RATIO_FACTOR, PLAYER_CHANCE_TO_HIT_FACTOR, PLAYER_CHANCE_TO_HIT_MIN, PLAYER_CHANCE_TO_HIT_MAX, PLAYER_DAMAGE_BONUS_FACTOR, PLAYER_LEVEL_POINTS } from "../../utils/Constants";
import { Utils } from "../../utils/Utils";
import { Entity } from "../Entity";
import { Position } from "../Poisition";
import { Size } from "../Size";
import { Monster } from "../monster/Monster";
import { WorldMap } from "../worldmap/WorldMap";
import { PlayerAttributes } from "./PlayerAttributes";
import { PlayerControlParams } from "./PlayerControlParams";
import { PlayerGameState } from "./PlayerGameState";
import { PlayerSkills } from "./PlayerSkills";
import { PlayerState } from "./PlayerState";
import { PlayerStats } from "./PlayerStats";

export interface PlayerProps {
  id: string;
  name: string;
  worldMapId: string;
}

export class Player implements Entity {
  public id: string;
  private name: string;
  private bounds: Size;
  private worldMapId: string;
  private stats: PlayerStats;
  private attributes: PlayerAttributes;
  private skills: PlayerSkills;
  private controlParams: PlayerControlParams;
  public position: Position;
  private targetPosition?: Position;
  private state: PlayerState;

  constructor(props: PlayerProps) {
    this.id = props.id;
    this.name = props.name;
    this.worldMapId = props.worldMapId;
    this.bounds = {
      width: PLAYER_BASE_TILESIZE,
      height: PLAYER_BASE_TILESIZE
    };
    this.attributes = {
      vitality: 20,
      charisma: 10,
      dexterity: 30,
      strength: 17,
      intelligence: 10,
      magic: 10,
    };
    this.controlParams = {
      hpCoolDown: 0,
      hasEnemiTarget: false
    };
    this.stats = {
      experience: 14565,
      health: 122,
      level: 20,
      mana: 67,
      maxHealth: 122,
      maxMana: 67,
      maxStamina: 122,
      stamina: 122,
      availableAttributesPoints: 3,
      nextLevelExperience: 14724,
      baseLevelExperience: 13001,
      hpCoolDown: PLAYER_HP_COOLDOWN,
    };
    this.position = {
      x: 3500,
      y: 3500
    };
    this.state = 'idle';
    this.skills = {
      axe: 100,
      hammer: 100,
      longSword: 100,
      shortSword: 100,
      staff: 100
    }

  }

  public update(game: Game) {
    this.updatePosition();
    this.updateHp();
    this.checkPortal(game);
  }

  public getGamePlayerState(): PlayerGameState {
    return {
      id: this.id,
      name: this.name,
      worldMapId: this.worldMapId,
      bounds: this.bounds,
      attributes: this.attributes,
      stats: this.stats,
      position: this.position,
      targetPosition: this.targetPosition,
      state: this.state,
      skills: this.skills,
    }
  }

  // getters
  // ---------------------------------------

  public get hitRatio(): number {
    return this.attributes.dexterity >= 50
      ? this.skills.shortSword + (this.attributes.dexterity - 50) * PLAYER_HIT_RATIO_FACTOR
      : this.skills.shortSword;
  }

  // public methods
  // ---------------------------------------

  public attackPlayer(enemy: Player) {
    if (!this.canAttack() || enemy.isDead()) return;

    // TODO: cuando hagamos el ataque a otro player
    //       ya lo tenemos listo, pero falta el calculo de la cosa de armadura
    //
    // if (this.isInAttackRange(enemy.position)) {
    //   this.setAttackMode();
    //   if (this.canHit(enemy.stats.armorClass)) {
    //     const damage = this.getDamage();
    //     enemy.hurt(damage);
    //     this.increaseScore(PLAYER_HIT_SCORE);
    //     if (enemy.isDead()) {
    //       this.increaseScore(PLAYER_EK_SCORE);
    //       this.increaseExperience(enemy.stats.experience)
    //     }
    //   }
    // }
    // else {
    //   this.followPlayer(enemy);
    // }
  }

  public attackMonster(monster: Monster) {
    if (!this.canAttack() || monster.isDead()) return;
    if (this.isInAttackRange(monster.position)) {
      this.setAttackMode();
      if (this.canHit(monster.stats.defenseRatio)) {
        const damage = this.getDamage(monster.stats.physicalAbsortion);
        monster.hurt(damage);
        if (monster.isDead()) {
          this.increaseExperience(monster.getExperience());
        }
      }
    } else {
      this.followMonster(monster);
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
    this.stats.health -= damage;
    if (this.stats.health > 0) {
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
    if (totalPoints > this.stats.availableAttributesPoints) return;

    this.attributes.dexterity += attributes.dexterity;
    this.attributes.strength += attributes.strength;
    this.attributes.vitality += attributes.vitality;
    this.attributes.charisma += attributes.charisma;
    this.attributes.intelligence += attributes.intelligence;
    this.attributes.magic += attributes.magic;

    this.stats.availableAttributesPoints -= totalPoints;

    this.recalculateStats();
  }

  public updatePosition() {
    if (!this.canMove()) return;
    this.state = "walk"
    this.advancePosition();
  }

  public updateHp() {
    this.controlParams.hpCoolDown++;
    if (this.controlParams.hpCoolDown > this.stats.hpCoolDown) {
      this.controlParams.hpCoolDown = 0;
      this.recoverHealth();
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

  private canHit(enemyDefenseRatio: number): boolean {
    const chanceToHit = (this.hitRatio / enemyDefenseRatio) * PLAYER_CHANCE_TO_HIT_FACTOR;
    const finalHitChange = Utils.fixProbability(
      chanceToHit,
      PLAYER_CHANCE_TO_HIT_MIN,
      PLAYER_CHANCE_TO_HIT_MAX
    )
    const attackThrow = Math.random();
    return attackThrow <= finalHitChange;
  }

  private getDamage(enemyPhysicalAbsortion: number = 0) {
    // Damage = weapon damage + str bonus (20% when str >= 100 or 40% if str >= 200)
    // Mock: using a Gladius sword
    const weaponDamage = 4;
    const strBonus = this.attributes.strength >= 100 ? weaponDamage * PLAYER_DAMAGE_BONUS_FACTOR : 0
    const damage = weaponDamage + strBonus

    console.log("Player weapon damage", weaponDamage)
    console.log("Player damage: ", damage);

    return damage - (damage * (enemyPhysicalAbsortion / 100));
  }

  private kill() {
    this.state = "dead";
  }

  private increaseExperience(value: number) {
    this.stats.experience += value;
    this.validateNewLevel();
  }

  private validateNewLevel() {
    if (this.stats.experience >= this.stats.nextLevelExperience) {
      this.stats.level += 1;
      this.stats.nextLevelExperience = PLAYER_EXPERIENCE_ARRAY[this.stats.level + 1];
      this.stats.availableAttributesPoints += PLAYER_LEVEL_POINTS;
      this.stats.health += Math.floor(this.stats.health / 2);
      this.validateNewLevel();
    }
  }

  private followPlayer(enemy: Player) {
    this.targetPosition = enemy.position;
    this.controlParams.hasEnemiTarget = true;
  }

  private followMonster(monster: Monster) {
    this.targetPosition = monster.position;
    this.controlParams.hasEnemiTarget = true;
  }

  private getTotalPoints(attributes: PlayerAttributes) {
    return Object.values(attributes).reduce((a, b) => a + b, 0);
  }

  private recalculateStats() {
    // TODO: cuando veamos como recalcula la HP en base a la vitality
    // this.stats.maxHp = PLAYER_BASE_HP
    //   + (this.attributes.vitality * 6);
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

  private increaseHealth(value: number) {
    this.stats.health += value;
    if (this.stats.health > this.stats.maxHealth) {
      this.stats.health = this.stats.maxHealth
    }
  }

  private recoverHealth() {
    this.increaseHealth(
      // TODO: ver como era el calculo
      2 + (this.attributes.vitality * 5)
    )
  }

  private checkPortal(game: Game) {
    const worldMap = game.getWorldMapById(this.worldMapId);
    if (worldMap) {
      const portal = worldMap.getPortalByPosition(
        this.position
      );
      if (portal) {
        this.worldMapId = portal.target.worldMapId;
        this.targetPosition = undefined;
        this.position = portal.target.position;
        this.state = 'idle';
      }
    }
  }
}