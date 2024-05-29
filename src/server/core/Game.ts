import { GameStateListener } from "./GameStateListener";
import { Monster } from "./entities/monster/Monster";
import { Player } from "./entities/player/Player";
import { WorldMap } from "./entities/worldmap/WorldMap";
import { GAME_LOOP_INTERVAL } from "./utils/Constants";

export class Game {
  public worldmaps: Record<string, WorldMap> = {};
  public gameStateListeners: GameStateListener[] = [];
  public changeMapListeners: any[] = [];

  constructor() {

  }

  public startLoop() {
    Object.values(this.worldmaps).forEach(worldMap => {
      setInterval(() => {
        worldMap.update();
        this.notifyGameState(worldMap);
      }, GAME_LOOP_INTERVAL);
    })
  }

  public addWorldMap(worldMap: WorldMap) {
    this.worldmaps[worldMap.id] = worldMap;
  }

  public removeWorldMap(id: string) {
    delete this.worldmaps[id];
  }

  public getWorldMapById(id: string) {
    return this.worldmaps[id];
  }

  public addGameStateListener(listener: GameStateListener) {
    this.gameStateListeners.push(listener);
  }

  public notifyGameState(worldMap: WorldMap) {
    this.gameStateListeners.forEach(listener => {
      listener.notify(
        worldMap.getWorldMapState()
      );
    })
  }

  public addChangeMapListener(listener: any) {
    // this.changeMapListeners.push(listener);
    Object.values(this.worldmaps).forEach(worldMap => {
      worldMap.addAddPlayerListener(listener)
    })
  }

  public getPlayerById(id: string): Player | undefined {
    for (const worldMap of Object.values(this.worldmaps)) {
      const player = worldMap.players[id];
      if (player) return player;
    }
  }

  public getMonsterById(id: string): Monster | undefined {
    for (const worldMap of Object.values(this.worldmaps)) {
      const monster = worldMap.monsters[id];
      if (monster) return monster;
    }
  }

  public removePlayer(id: string) {
    const player = this.getPlayerById(id);
    if (player) {
      this.getWorldMapById(player.worldMapId).removePlayer(player.id);
    }
  }

  // public notifyChangeMap(playerId: string, newWorldMapId: string, oldWorldMapId: string) {
  //   this.changeMapListeners.forEach(listener => {
  //     listener.notify({
  //       playerId,
  //       newWorldMapId,
  //       oldWorldMapId
  //     })
  //   })
  // }

}