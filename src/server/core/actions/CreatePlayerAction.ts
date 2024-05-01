import { GameState } from "../../../domain/GameState";
import { Player } from "../../../domain/Player";
import { PlayerEntity } from "../entities/PlayerEntity";
import { EXPERIENCE_TABLE, PLAYER_BASE_ARMOR_CLASS } from "../utils/Constants";
import { Utils } from "../utils/Utils";
import { Action } from "./Action";

export interface CreatePlayerActionParams {
  id: string;
  name: string;
}

export class CreatePlayerAction implements Action<CreatePlayerActionParams, void> {
  constructor(private readonly gameState: GameState) { }

  public execute(input: CreatePlayerActionParams): void {
    const player = new PlayerEntity({
      id: input.id,
      name: input.name,
      color: Utils.getRandomHexColor(),
      hp: 100,
      maxHp: 100,
      position: Utils.getRandomPositionByRadius(200),
      state: 'idle',
      score: 0,
      stats: {
        vitality: 1,
        dextery: 1,
        strength: 1,
      },
      level: 1,
      experience: EXPERIENCE_TABLE[1],
      nextLevelExperience: EXPERIENCE_TABLE[2],
      armorClass: PLAYER_BASE_ARMOR_CLASS,
      hasEnemiTarget: false,
      availablePoints: 0
    });
    this.gameState.players[input.id] = player;
  }
}