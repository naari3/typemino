import * as PIXI from "pixi.js";

export class StateRenderer {
  private container: PIXI.Container;
  private stateContainer: PIXI.Container;

  private stateText: PIXI.Text;

  public constructor(container: PIXI.Container) {
    this.container = container;

    this.stateContainer = new PIXI.Container();
    this.stateContainer.position.x = 16 * 10.5;
    this.stateContainer.position.y = 16 * 13;
    this.stateText = null;

    this.container.addChild(this.stateContainer);
  }

  public renderState(state: string): void {
    if (this.stateText !== null) this.stateText.destroy();
    this.stateText = new PIXI.Text(state, { fontSize: 18 });
    this.stateContainer.addChild(this.stateText);
  }
}
