export interface IEventType {
  [key: string]: any;
  type: string;
}

export interface IEvent<T = unknown, U = IEmitter> {
  [key: string]: any;

  type: string;
  target: T;
  currentTarget: U;
  isImmediatePropagationStopped: boolean;
  stopImmediatePropagation(): void;
  startImmediatePropagation(): void;
}

export interface IEmitter {
  _events: IEventTransports;

  on(
    eventName: string | string[],
    fn: IEventListener,
    ctx?: any,
  ): this;

  once(
    eventName: string | string[],
    fn: IEventListener,
    ctx?: any,
  ): this;

  off(
    eventName: string | string[],
    fn: IEventListener,
  ): this;

  emit(eventArgs: string | IEventType): number;

  removeAllListeners(eventName?: string | string[]): this;
}

export type IEventListener<T = unknown, U = IEmitter> = (evt: IEvent<T, U>) => any;

export interface IEventTransport {
  fn: IEventListener;
  once: boolean;
  ctx: any;
}

export interface IEventTransports {
  [eventName: string]: IEventTransport[];
}
