import { GameState } from "./GameState";
import { GameStateListener } from "./GameStateListener";
import { Monster } from "./entities/monster/Monster";
import { MonsterGameState } from "./entities/monster/MonsterGameState";
import { Player } from "./entities/player/Player";
import { PlayerGameState } from "./entities/player/PlayerGameState";
import { GAME_LOOP_INTERVAL } from "./utils/Constants";

export class Game {
  public players: Record<string, Player> = {};
  public monsters: Record<string, Monster> = {};
  public gameStateListeners: GameStateListener[] = [];

  constructor() {

  }

  public startLoop() {
    setInterval(() => {
      this.updatePlayers();
      this.updateMonsters();
      this.notifyGameState();
    }, GAME_LOOP_INTERVAL);
  }

  public addPlayer(player: Player) {
    this.players[player.id] = player;
  }

  public addMonster(monster: Monster) {
    this.monsters[monster.id] = monster;
  }

  public removePlayer(id: string) {
    delete this.players[id];
  }

  public removeMonster(id: string) {
    delete this.monsters[id];
  }

  public addGameStateListener(listener: GameStateListener) {
    this.gameStateListeners.push(listener);
  }

  public notifyGameState() {
    this.gameStateListeners.forEach(listener => {
      listener.notify(
        this.getGameState()
      );
    })
  }

  private updatePlayers() {
    Object.values(this.players).forEach(player => {
      player.update();
    })
  }

  private updateMonsters() {
    Object.values(this.monsters).forEach(monster => {
      monster.update();
    })
  }

  private getGameState() {
    return {
      players: this.mapPlayerEntitiesMapToPlayerMap(this.players),
      monsters: this.mapMonsterEntitiesMapToMonstersMap(this.monsters),
    }
  }

  private mapPlayerEntitiesMapToPlayerMap(players: Record<string, Player>) {
    return Object.values(players).reduce((acc, curr: Player) => {
      acc[curr.id] = curr.getGamePlayerState()
      return acc
    }, {} as Record<string, PlayerGameState>)
  }

  private mapMonsterEntitiesMapToMonstersMap(monsters: Record<string, Monster>) {
    return Object.values(monsters).reduce((acc, curr: Monster) => {
      acc[curr.id] = curr.getMonsterGameState()
      return acc
    }, {} as Record<string, MonsterGameState>)
  }

}