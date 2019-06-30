import { Observer } from "./Observer";

export interface Observable {
  on(reader: Observer<this>): void;
  notify(): void;
}
