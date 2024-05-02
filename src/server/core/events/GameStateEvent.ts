import { GameState } from "../../../domain/GameState";
import { Monster } from "../../../domain/Monster";
import { Player } from "../../../domain/Player";
import { MonsterEntity } from "../entities/MonsterEntity";
import { PlayerEntity } from "../entities/PlayerEntity";

export class GameStateEvent {
  constructor(private readonly gameState: GameState) { }

  execute() {
    this.gameState.players
    return {
      players: this.mapPlayerEntitiesMapToPlayerMap(this.gameState.players),
      monsters: this.mapMonstersEntitiesMapToMonstersMap(this.gameState.monsters)
    };
  }

  private mapPlayerEntitiesMapToPlayerMap(players: Record<string, PlayerEntity>) {
    return Object.values(players).reduce((acc, curr: PlayerEntity) => {
      acc[curr.playerState.id] = curr.playerState
      return acc
    }, {} as Record<string, Player>)
  }

  private mapMonstersEntitiesMapToMonstersMap(monsters: Record<string, MonsterEntity>) {
    return Object.values(monsters).reduce((acc, curr: MonsterEntity) => {
      acc[curr.monsterState.id] = curr.monsterState
      return acc
    }, {} as Record<string, Monster>)
  }
}