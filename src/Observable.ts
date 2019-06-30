import { Observer } from "./Observer";

export abstract class Observable {
  private observers: Observer<this>[];

  public constructor() {
    this.observers = [];
  }

  public on(reader: Observer<this>): void {
    this.observers.push(reader);
  }

  public notify(): void {
    this.observers.forEach((reader): void => {
      reader.update(this);
    });
  }
}
