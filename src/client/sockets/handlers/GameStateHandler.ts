import { PlayerEntity } from "../../entities/player/PlayerEntity";
import { Scene } from "phaser";
import { SocketManager } from "../SocketManager";
import { GameHud } from "../../huds/GameHud";
import { GameState } from "../domain/GameState";
import { MonsterEntity } from "../../entities/monster/MonsterEntity";
import { WorldMapEntity } from "../../entities/worldmap/WorldMapEntity";

export class GameStateHandler {



  constructor(
    private readonly socketManager: SocketManager,
    private readonly scene: Scene,
    private readonly players: Record<string, PlayerEntity>,
    private readonly monsters: Record<string, MonsterEntity>,
    private readonly worldMap: WorldMapEntity,
    private readonly gameHud: GameHud
  ) { }

  public execute(gameState: GameState) {
    this.gameHud.setGameState(gameState);

    Object.keys(gameState.players).forEach((key) => {
      const player = gameState.players[key];
      if (!this.players[key]) {
        this.players[key] = new PlayerEntity(this.scene, player);
        if (key === this.socketManager.getId()) {
          this.players[key].setMainPlayer(true);
          this.scene.cameras.main.startFollow(this.players[key]);
          this.worldMap.changeMap(player.worldMapId);



          // _________________________


          this.players[key].onDie = () => {
            this.socketManager.disconnect();
            this.scene.scene.stop("GameHud");
            this.scene.scene.start("StartScene", {
              name: this.players[key].getPlayerState().name
            });
          }
        } else {
          this.players[key].onDie = () => {
            if (this.players[key]) {
              this.players[key].destroy();
            }
            delete this.players[key];
          }
        }
      } else {
        if (key === this.socketManager.getId()) {
          // LO NUEVO DE LOS PORTALES

          const oldPlayer = this.players[key];
          const oldWorldMapId = oldPlayer.getPlayerState().worldMapId;
          const newWorldMapId = player.worldMapId;

          if (oldWorldMapId !== newWorldMapId) {
            this.worldMap.changeMap(newWorldMapId);
          }
        }
        if (this.players[key])
          this.players[key].setPlayerState(player);
      }
    });

    // Object.keys(gameState.monsters).forEach((key) => {
    //   const monster = gameState.monsters[key];
    //   if (!this.monsters[key]) {
    //     this.monsters[key] = new MonsterEntity(this.scene, monster);
    //     this.monsters[key].onDie = () => {
    //       if (this.monsters[key]) {
    //         this.monsters[key].destroy();
    //       }
    //       delete this.monsters[key];
    //     }
    //   } else {
    //     if (this.monsters[key])
    //       this.monsters[key].setMonsterState(monster);
    //   }
    // });

  }

}