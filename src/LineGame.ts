import { Game } from "./Game";
import { SettingData } from "./Settings";
import { LineInfoRenderer } from "./renderers/LineInfoRenderer";

const noAre = {
  areTime: 0,
  lineAreTime: 0,
  lineClearTime: 0
};

export class LineGame extends Game {
  private lineInfoRenderer: LineInfoRenderer;
  private remains: number;
  public constructor(w: number, h: number, settings: SettingData) {
    super(w, h, Object.assign(settings, noAre));
    this.lineInfoRenderer = new LineInfoRenderer(this.container);

    this.remains = 40;
    this.lineInfoRenderer.renderRemains(this.remains);
  }

  protected calcScore(clearLines: number): void {
    this.remains -= clearLines;

    if (this.remains <= 0) {
      this.remains = 0;
      this.gameState = "gameover";
    }

    this.lineInfoRenderer.renderRemains(this.remains);
  }
}
