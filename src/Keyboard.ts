export class Keyboard {
  public press: Function;
  public pressing: Function;
  public release: Function;
  public releasing: Function;
  private keyName: string;
  private isUp: boolean;
  private isDown: boolean;

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
      if (this.releasing) this.releasing();
      this.isDown = false;
      this.isUp = true;
    }
  }

  private downHandler(event: KeyboardEvent): void {
    if (event.key == this.keyName) {
      event.preventDefault();
      if (this.isUp && this.press) this.press();
      if (this.pressing) this.pressing();
      this.isUp = false;
      this.isDown = true;
    }
  }
}
