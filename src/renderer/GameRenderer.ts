import * as PIXI from "pixi.js";
import { Field } from "../Field";
import { FieldRenderer } from "./FieldRenderer";
import { TetrominoRenderer } from "./TetrominoRenderer";
import { Tetromino } from "../Tetromino";
import { GhostRenderer } from "./GhostRenderer";
import { NextTetrominoRenderer } from "./NextTetrominoRenderer";
import { Holder } from "../Holder";
import { HolderRenderer } from "./HolderRenderer";

export class GameRenderer {
  private container: PIXI.Container;
  private fieldContainer: PIXI.Container;
  private nextContainer: PIXI.Container;
  private nextnext1Container: PIXI.Container;
  private nextnext2Container: PIXI.Container;
  private holderContainer: PIXI.Container;

  private fieldRenderer: FieldRenderer;
  private tetrominoRenderer: TetrominoRenderer;
  private ghostRenderer: GhostRenderer;
  private nextRenderer: NextTetrominoRenderer;
  private nextnext1Renderer: NextTetrominoRenderer;
  private nextnext2Renderer: NextTetrominoRenderer;
  private holderRenderer: HolderRenderer;

  private tetrominoQueue: Tetromino[];

  public constructor(
    container: PIXI.Container,
    field: Field,
    tetrominoQueue: Tetromino[],
    holder: Holder
  ) {
    this.container = container;

    this.fieldContainer = new PIXI.Container();
    this.fieldRenderer = new FieldRenderer(this.fieldContainer, field);
    this.tetrominoRenderer = new TetrominoRenderer(this.fieldContainer);
    this.ghostRenderer = new GhostRenderer(this.fieldContainer);
    this.fieldContainer.position.x = 16 * 7;
    this.fieldContainer.position.y = 16 * 3;

    this.tetrominoQueue = tetrominoQueue;
    this.nextContainer = new PIXI.Container();
    this.nextnext1Container = new PIXI.Container();
    this.nextnext2Container = new PIXI.Container();
    this.nextRenderer = new NextTetrominoRenderer(this.nextContainer);
    this.nextnext1Renderer = new NextTetrominoRenderer(this.nextnext1Container);
    this.nextnext2Renderer = new NextTetrominoRenderer(this.nextnext2Container);
    this.nextContainer.position.x = 16 * 19;
    this.nextContainer.position.y = 16 * 5 + 8;
    this.nextnext1Container.position.x = 16 * 19 + 4;
    this.nextnext1Container.position.y = 16 * 11;
    this.nextnext2Container.position.x = 16 * 19 + 4;
    this.nextnext2Container.position.y = 16 * 16;
    this.nextnext1Container.scale.set(0.8);
    this.nextnext2Container.scale.set(0.8);

    this.holderContainer = new PIXI.Container();
    this.holderRenderer = new HolderRenderer(this.holderContainer, holder);
    this.holderContainer.position.x = 16 * 2 - 4;
    this.holderContainer.position.y = 16 * 8;
    this.holderContainer.scale.set(0.8);

    this.container.addChild(this.fieldContainer);
    this.container.addChild(this.nextContainer);
    this.container.addChild(this.nextnext1Container);
    this.container.addChild(this.nextnext2Container);
    this.container.addChild(this.holderContainer);
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
  public renderHolder(): void {
    this.holderRenderer.render();
  }
  public renderNext(): void {
    this.nextRenderer.render(this.tetrominoQueue[0].type);
    this.nextnext1Renderer.render(this.tetrominoQueue[1].type);
    this.nextnext2Renderer.render(this.tetrominoQueue[2].type);
  }
}
