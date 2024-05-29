import { Game } from "../Game";
import { Player } from "../entities/player/Player";
import { Action } from "./Action";

export interface CreatePlayerActionParams {
  id: string;
  name: string;
}

export class CreatePlayerAction implements Action<CreatePlayerActionParams, void> {
  constructor(private readonly game: Game) { }

  public execute(input: CreatePlayerActionParams): void {
    const player = new Player({
      id: input.id,
      name: input.name,
      worldMapId: "test"
    });
    const worldMap = this.game.getWorldMapById(player.worldMapId);
    if (!worldMap) return;
    worldMap.addPlayer(player);
    worldMap.teleportPlayer(player, player.worldMapId);
  }
}