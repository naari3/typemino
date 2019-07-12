import { Keyboard } from "./Keyboard";

export interface SelectListElementType {
  label: string;
  callback: Function;
}

export class SelectList {
  private elements: SelectListElementType[];
  private nowSelected: number;

  public constructor(elements: SelectListElementType[]) {
    this.elements = elements;
    this.nowSelected = 0;
  }

  public selectUp(): void {
    this.nowSelected--;
    if (this.nowSelected < 0) {
      this.nowSelected = this.elements.length - 1;
    }
    this.notify();
  }

  public selectDown(): void {
    this.nowSelected++;
    this.nowSelected %= this.elements.length;
    this.notify();
  }

  private notify(): void {
    console.log(this.elements[this.nowSelected]);
  }

  public select(): void {
    this.elements[this.nowSelected].callback();
  }
}
