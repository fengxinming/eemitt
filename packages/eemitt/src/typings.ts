export interface EventArgs {
  [key: string]: any;
  type: string;
}

export interface Eventer<T> {
  [key: string]: any;

  type: string;
  target: any;
  currentTarget: T;
  _isImmediatePropagationStopped: boolean;
  stopImmediatePropagation(): void;
  startImmediatePropagation(): void;
}

export type EventerListener<T> = (evt: Eventer<T>, meta?: any) => any;

export interface EventHandler<T> {
  fn: EventerListener<T>;
  once: boolean;
  meta: any | undefined;
}

export interface EventHandlers<T> {
  [eventName: string]: Array<EventHandler<T>>;
}
