import { GameState } from "../../../domain/GameState";
import { Player } from "../../../domain/Player";
import { Utils } from "../utils/Utils";
import { Action } from "./Action";

export interface CreatePlayerActionParams {
  id: string;
  name: string;
}

export class CreatePlayerAction implements Action<CreatePlayerActionParams, void> {
  constructor(private readonly gameState: GameState) { }

  public execute(input: CreatePlayerActionParams): void {
    const player: Player = {
      id: input.id,
      name: input.name,
      color: Utils.getRandomHexColor(),
      hp: 100,
      maxHp: 100,
      position: Utils.getRandomPositionByRadius(200),
      state: 'idle',
      score: 0,
    }
    this.gameState.players[player.id] = player;
  }
}