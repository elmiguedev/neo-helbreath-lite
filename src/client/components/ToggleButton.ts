import { Button } from "./Button";

export class ToggleButton extends Button {
  private _active: boolean = false;
  private activeText: string;
  private inactiveText: string;
  public onToggle?: (value: boolean) => void;


  constructor(scene: Phaser.Scene, x: number, y: number, activeText?: string, inactiveText?: string) {
    super(scene, x, y, activeText);
    this.activeText = activeText || "";
    this.inactiveText = inactiveText || "";
    this.setText(this._active ? this.activeText : this.inactiveText);
    this.onClick = () => {
      this.toggle();
    }
  }

  public toggle() {
    this._active = !this._active;
    this.setText(this._active ? this.activeText : this.inactiveText);

    if (this.onToggle) {
      this.onToggle(this._active);
    }
    return this._active;
  }

  public isActive() {
    return this._active
  }

}