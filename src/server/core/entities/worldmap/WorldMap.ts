import { Position } from "../Poisition";
import { Size } from "../Size";
import { Monster } from "../monster/Monster";
import { MonsterGameState } from "../monster/MonsterGameState";
import { Player } from "../player/Player";
import { PlayerGameState } from "../player/PlayerGameState";
import { PortalBlock } from "./PortalBlock";
import { TiledMap, TiledMapObject } from "./TiledMap";

export interface WorldMapProps {
  id: string;
  tiled: TiledMap;
}

export class WorldMap {
  public id: string;
  private tiled: TiledMap;
  private size: Size;
  private portals: PortalBlock[];

  public players: Record<string, Player> = {};
  public monsters: Record<string, Monster> = {};

  public addPlayerListener: any[] = [];

  constructor(props: WorldMapProps) {
    this.id = props.id;
    this.tiled = props.tiled;
    this.portals = [];
    this.size = {
      width: props.tiled.getWidthInPixels(),
      height: props.tiled.getHeightInPixels()
    }

    this.createPortals();
  }

  public update() {
    this.updatePlayers();
    this.updateMonsters();
  }

  public getPortalByPosition(position: Position): PortalBlock | undefined {
    return this.portals.find(p =>
      position.x <= p.position.x + p.size.width &&
      position.x >= p.position.x &&
      position.y <= p.position.y &&
      position.y >= p.position.y - p.size.height // Esto es asi porque asi es TILED 🫠
    );
  }

  public addPlayer(player: Player) {
    this.players[player.id] = player;
    // this.addPlayerListener.forEach(listener => listener.notify({
    //   playerId: player.id,
    //   newWorldMapId: this.id,
    //   oldWorldMapId: player.worldMapId
    // }));
  }

  public removePlayer(id: string) {
    delete this.players[id];
  }

  public addMonster(monster: Monster) {
    this.monsters[monster.id] = monster;
  }

  public removeMonster(id: string) {
    delete this.monsters[id];
  }

  public getWorldMapState() {
    return {
      worldMapId: this.id,
      players: this.mapPlayerEntitiesMapToPlayerMap(this.players),
      monsters: this.mapMonsterEntitiesMapToMonstersMap(this.monsters),
    }
  }

  public addAddPlayerListener(listener: any) {
    this.addPlayerListener.push(listener);
  }

  public teleportPlayer(player: Player, newWorldMapId: string, oldWorldMapId?: string) {
    this.addPlayerListener.forEach(listener => listener.notify({
      playerId: player.id,
      newWorldMapId: newWorldMapId,
      oldWorldMapId: oldWorldMapId
    }))
  }

  private createPortals() {
    const objectLayer = this.tiled.getLayer("objects")
    objectLayer?.objects?.forEach((object: TiledMapObject) => {
      if (object.type === "portal") {
        const targetPositionX: number = object.properties.find(p => p.name === "targetPositionX")?.value;
        const targetPositionY: number = object.properties.find(p => p.name === "targetPositionY")?.value;
        const targetWorldMapId: string = object.properties.find(p => p.name === "targetWorldMapId")?.value;

        if (!targetPositionX || !targetPositionY || !targetWorldMapId) {
          return;
        }

        const portal: PortalBlock = {
          worldMapId: this.id,
          size: {
            width: object.width,
            height: object.height
          },
          position: {
            x: object.x,
            y: object.y
          },
          target: {
            position: {
              x: targetPositionX,
              y: targetPositionY
            },
            worldMapId: targetWorldMapId
          }
        }

        this.portals.push(portal);

      }
    })
  }

  private updatePlayers() {
    Object.values(this.players).forEach(player => {
      player.update(this);
    })
  }

  private updateMonsters() {
    Object.values(this.monsters).forEach(monster => {
      monster.update(this);
    })
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