import { GameState } from "../../../domain/GameState";
import { Player } from "../../../domain/Player";
import { PlayerEntity } from "../entities/PlayerEntity";

export class GameStateEvent {
  constructor(private readonly gameState: GameState) { }

  execute() {
    this.gameState.players
    return {
      players: this.mapPlayerEntitiesMapToPlayerMap(this.gameState.players),
    };
  }

  private mapPlayerEntitiesMapToPlayerMap(players: Record<string, PlayerEntity>) {
    return Object.values(players).reduce((acc, curr: PlayerEntity) => {
      acc[curr.playerState.id] = curr.playerState
      return acc
    }, {} as Record<string, Player>)
  }
}