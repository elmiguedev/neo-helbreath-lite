import { Position } from "../Poisition";
import { Size } from "../Size";
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
  // private solids: SolidBlock[]

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

  public getPortalByPosition(position: Position): PortalBlock | undefined {
    return this.portals.find(p =>
      position.x <= p.position.x + p.size.width &&
      position.x >= p.position.x &&
      position.y <= p.position.y &&
      position.y >= p.position.y - p.size.height // Esto es asi porque asi es TILED 🫠
    );
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



}