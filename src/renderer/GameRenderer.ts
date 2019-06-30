import * as PIXI from "pixi.js";
import { Field } from "../Field";
import { TetrominoRenderer } from "./TetrominoRenderer";
import { Tetromino } from "../Tetromino";
import { GhostRenderer } from "./GhostRenderer";
import Constants from "../Constants";

export class GameRenderer {
  private container: PIXI.Container;
  private bgContainer: PIXI.Container;
  private fieldContainer: PIXI.Container;
  private timerContainer: PIXI.Container;

  private tetrominoRenderer: TetrominoRenderer;
  private ghostRenderer: GhostRenderer;
  private timerText: PIXI.Text;

  public constructor(container: PIXI.Container) {
    this.container = container;

    this.bgContainer = new PIXI.Container();
    const fieldBackground = this.fieldBackground();
    fieldBackground.position.x = 16 * 7;
    fieldBackground.position.y = 16 * 3;
    this.bgContainer.addChild(fieldBackground);

    const holdBackground = this.holdBackground();
    holdBackground.position.x = 16 * 1;
    holdBackground.position.y = 16 * 7;
    this.bgContainer.addChild(holdBackground);

    const nextBackground = this.nextBackground();
    nextBackground.position.x = 16 * 18;
    nextBackground.position.y = 16 * 4;
    this.bgContainer.addChild(nextBackground);

    const nextnext1Background = this.nextnextBackground();
    const nextnext2Background = this.nextnextBackground();
    const nextnextPositionX = 16 * 18 + 8;
    nextnext1Background.position.x = nextnextPositionX;
    nextnext1Background.position.y = 16 * 10;
    nextnext2Background.position.x = nextnextPositionX;
    nextnext2Background.position.y = 16 * 15;
    this.bgContainer.addChild(nextnext1Background);
    this.bgContainer.addChild(nextnext2Background);

    this.fieldContainer = new PIXI.Container();
    this.tetrominoRenderer = new TetrominoRenderer(this.fieldContainer);
    this.ghostRenderer = new GhostRenderer(this.fieldContainer);
    this.fieldContainer.position.x = 16 * 7;
    this.fieldContainer.position.y = 16 * 3;

    this.timerContainer = new PIXI.Container();
    this.timerContainer.position.x = 16 * 18;
    this.timerContainer.position.y = 16 * 22;
    this.timerText = null;

    this.container.addChild(this.bgContainer);
    this.container.addChild(this.fieldContainer);
    this.container.addChild(this.timerContainer);
  }

  public renderTetromino(tetromino: Tetromino): void {
    this.tetrominoRenderer.render(tetromino);
  }
  public clearRenderedTetromino(): void {
    this.tetrominoRenderer.clearRendered();
  }
  public renderGhost(tetromino: Tetromino, field: Field): void {
    this.ghostRenderer.render(tetromino, field);
  }
  public clearRenderedGhost(): void {
    this.ghostRenderer.clearRendered();
  }
  public renderTimer(time: string): void {
    if (this.timerText !== null) this.timerText.destroy();
    this.timerText = new PIXI.Text(time, { fontSize: 18 });
    this.timerContainer.addChild(this.timerText);
  }

  protected fieldBackground(): PIXI.Graphics {
    const graphics = new PIXI.Graphics();

    // field frame
    graphics.lineStyle(4, 0xffffff, 1, 1);
    graphics.beginFill(0x000000, 0.5);
    graphics.drawRect(0, 0, 16 * 10, 16 * 20);
    graphics.endFill();

    // lattice
    for (let x = 0; x < Constants.blockWidth; x++) {
      graphics.lineStyle(1, 0xffffffff, 0.1);
      graphics.moveTo(16 * (x + 1), 0);
      graphics.lineTo(16 * (x + 1), 16 * 20);
    }
    for (let y = 0; y < Constants.blockHeight; y++) {
      graphics.lineStyle(1, 0xffffffff, 0.1);
      graphics.moveTo(0, 16 * (y + 1));
      graphics.lineTo(16 * 10, 16 * (y + 1));
    }

    return graphics;
  }

  protected holdBackground(): PIXI.Graphics {
    const graphics = new PIXI.Graphics();

    // hold frame
    graphics.lineStyle(4, 0xffffff, 1, 1);
    graphics.beginFill(0x000000, 0.5);
    graphics.drawRect(0, 0, 16 * 4, 16 * 4);
    graphics.endFill();
    graphics.width = 16 * 4;
    graphics.height = 16 * 4;

    return graphics;
  }

  protected nextBackground(): PIXI.Graphics {
    const graphics = new PIXI.Graphics();

    // hold frame
    graphics.lineStyle(4, 0xffffff, 1, 1);
    graphics.beginFill(0x000000, 0.5);
    graphics.drawRect(0, 0, 16 * 5, 16 * 5);
    graphics.endFill();

    return graphics;
  }

  protected nextnextBackground(): PIXI.Graphics {
    const graphics = new PIXI.Graphics();

    // hold frame
    graphics.lineStyle(4, 0xffffff, 1, 1);
    graphics.beginFill(0x000000, 0.5);
    graphics.drawRect(0, 0, 16 * 4, 16 * 4);
    graphics.endFill();

    return graphics;
  }
}
