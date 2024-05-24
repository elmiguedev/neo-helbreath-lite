export class WorldMapEntity {
  private scene: Phaser.Scene;
  private tilemap: Phaser.Tilemaps.Tilemap;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  public clearMap() {
    this.tilemap && this.tilemap.destroy();
  }

  public createMap(worldMapId: string) {
    this.tilemap = this.scene.add.tilemap(worldMapId);
    const terrainTileset = this.tilemap.addTilesetImage("terrain", "terrain");
    if (terrainTileset) {
      this.tilemap.createLayer(`floor`, [terrainTileset])!.setDepth(1);
    }
  }

  public changeMap(worldMapId: string) {
    this.clearMap();
    this.createMap(worldMapId);
  }

  public isEmpty() {
    return !this.tilemap;
  }



}