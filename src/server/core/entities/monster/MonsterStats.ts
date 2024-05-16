export interface MonsterStats {
  health: number;
  maxHealth: number;
  mana: number;
  maxMana: number;
  hitRatio: number;
  defenseRatio: number;
  damageDiceThrow: number;
  damageDiceRange: number;
  physicalAbsortion: number;
  minExperience: number;
  maxExperience: number;
  velocity: number;
  attackInterval: number;
  moveInterval: number; // En principio serian 1000 pero podriamos mejorarlo para que cada bicho tenga el suyo
  attackRange: number; // distancia para que el chobi ataques
  targetRange: number;
}