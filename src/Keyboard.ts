export class Keyboard {
  public press: Function;
  public release: Function;
  private keyName: string;
  public isUp: boolean;
  public isDown: boolean;

  public constructor(keyName: string) {
    this.keyName = keyName;
    this.isUp = true;
    this.isDown = false;

    document.addEventListener("keyup", this.upHandler.bind(this), false);
    document.addEventListener("keydown", this.downHandler.bind(this), false);
  }

  private upHandler(event: KeyboardEvent): void {
    if (event.key == this.keyName) {
      event.preventDefault();
      if (this.isDown && this.release) this.release();
      this.isDown = false;
      this.isUp = true;
    }
  }

  private downHandler(event: KeyboardEvent): void {
    if (event.key == this.keyName) {
      event.preventDefault();
      if (this.isUp && this.press) this.press();
      this.isUp = false;
      this.isDown = true;
    }
  }
}
