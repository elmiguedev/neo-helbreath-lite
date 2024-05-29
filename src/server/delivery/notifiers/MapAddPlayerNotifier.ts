import { Game } from "../../core/Game";
import { SocketServer } from "../SocketServer";

export class MapAddPlayerNotifier {

  constructor(
    private readonly socketServer: SocketServer,
    private readonly game: Game
  ) { }

  notify(data: {
    playerId: string,
    newWorldMapId: string,
    oldWorldMapId?: string
  }): void {

    console.log("NOTIFICA ", data);
    const player = this.game.getPlayerById(data.playerId);
    if (!player) return;

    const newWorldMap = this.game.getWorldMapById(data.newWorldMapId);
    newWorldMap.addPlayer(player);

    if (data.oldWorldMapId) {
      const oldWorldMap = this.game.getWorldMapById(data.oldWorldMapId);
      oldWorldMap.removePlayer(data.playerId);
    }

    this.socketServer.changePlayerRoom(
      data.playerId,
      data.newWorldMapId,
      data.oldWorldMapId
    )
  }

}