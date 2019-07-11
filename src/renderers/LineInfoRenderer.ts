import * as PIXI from "pixi.js";

export class LineInfoRenderer {
  private container: PIXI.Container;
  private remainsContainer: PIXI.Container;

  private remainsText: PIXI.Text;

  public constructor(container: PIXI.Container) {
    this.container = container;

    this.remainsContainer = new PIXI.Container();
    this.remainsContainer.position.x = 16 * 18;
    this.remainsContainer.position.y = 16 * 20;
    this.remainsText = null;

    this.container.addChild(this.remainsContainer);
  }

  public renderRemains(remains: number): void {
    if (this.remainsText !== null) this.remainsText.destroy();
    this.remainsText = new PIXI.Text(`${remains}`, { fontSize: 16 });
    this.remainsContainer.addChild(this.remainsText);
  }
}
