import * as PIXI from "pixi.js";
import { Field } from "./Field";
import { FieldRenderer } from "./FieldRenderer";
import { TetrominoRenderer } from "./TetrominoRenderer";
import { Tetromino } from "./Tetromino";
import { GhostRenderer } from "./GhostRenderer";

export class GameRenderer {
  private container: PIXI.Container;
  private fieldContainer: PIXI.Container;
  private fieldRenderer: FieldRenderer;
  private tetrominoRenderer: TetrominoRenderer;
  private ghostRenderer: GhostRenderer;

  public constructor(container: PIXI.Container, field: Field) {
    this.container = container;

    this.fieldContainer = new PIXI.Container();
    this.fieldRenderer = new FieldRenderer(this.fieldContainer, field);
    this.tetrominoRenderer = new TetrominoRenderer(this.fieldContainer);
    this.ghostRenderer = new GhostRenderer(this.fieldContainer);
    this.fieldContainer.position.x = 16 * 7;
    this.fieldContainer.position.y = 16 * 3;

    this.container.addChild(this.fieldContainer);
  }

  public renderTetromino(tetromino: Tetromino): void {
    this.tetrominoRenderer.render(tetromino);
  }
  public clearRenderedTetromino(): void {
    this.tetrominoRenderer.clearRendered();
  }
  public renderField(): void {
    this.fieldRenderer.render();
  }
  public renderGhost(tetromino: Tetromino, field: Field): void {
    this.ghostRenderer.render(tetromino, field);
  }
  public clearRenderedGhost(): void {
    this.ghostRenderer.clearRendered();
  }
  public renderHolder(): void {}
  public renderNext(): void {}
}
