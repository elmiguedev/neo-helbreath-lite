import { PlayerEntity } from "../../entities/player/PlayerEntity";

export class PlayerDisconnectedHandler {
  constructor(private readonly players: Record<string, PlayerEntity>) {
  }

  public execute(id: string) {
    const player = this.players[id];
    if (player) {
      player.destroy();
      delete this.players[id];
    }
  }

}