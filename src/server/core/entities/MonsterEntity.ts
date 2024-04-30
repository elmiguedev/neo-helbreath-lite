import { Monster } from "../../../domain/Monster";

export class MonsterEntity {
  public monsterState: Monster;
  constructor(monsterState: Monster) {
    this.monsterState = monsterState;
  }


}