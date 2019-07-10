import * as PIXI from "pixi.js";

export class Master3InfoRenderer {
  private container: PIXI.Container;
  private levelContainer: PIXI.Container;

  private levelText: PIXI.Text;

  public constructor(container: PIXI.Container) {
    this.container = container;

    this.levelContainer = new PIXI.Container();
    this.levelContainer.position.x = 16 * 18;
    this.levelContainer.position.y = 16 * 20;
    this.levelText = null;

    this.container.addChild(this.levelContainer);
  }

  public renderLevel(level: number): void {
    if (this.levelText !== null) this.levelText.destroy();
    this.levelText = new PIXI.Text(
      `${level} / ${level === 999 ? 999 : Math.ceil((level + 1) / 100) * 100}`,
      { fontSize: 16 }
    );
    this.levelContainer.addChild(this.levelText);
  }
}
