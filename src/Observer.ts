export interface Observer<T> {
  update(arg: T): void;
}
