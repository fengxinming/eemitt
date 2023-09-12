import { IEventTypeArgs, IEmitter, IEmitterEvent, IEventHandler, IEventHandlers, TEmitterListener } from './typings';

function createEventHandler(
  fn: TEmitterListener,
  once: boolean,
  ctx: any
): IEventHandler {
  return { fn, once, ctx };
}

export class EmitterEvent implements IEmitterEvent {
  [key: string]: any;

  type!: string;
  target: any;
  currentTarget: IEmitter;
  isImmediatePropagationStopped: boolean;

  constructor(eventType: string | IEventTypeArgs, currentTarget: IEmitter) {
    this.target = currentTarget;
    this.currentTarget = currentTarget;
    this.isImmediatePropagationStopped = true;

    if (typeof eventType === 'string') {
      this.type = eventType;
    }
    else {
      Object.assign(this, eventType);
    }
  }

  stopImmediatePropagation(): void {
    this.isImmediatePropagationStopped = false;
  }
}

export function addListener(
  emitter: IEmitter,
  eventName: string,
  fn: TEmitterListener,
  ctx: any,
  once: boolean,
): void {
  let ehs = emitter._events[eventName];
  if (!ehs) {
    ehs = [];
    emitter._events[eventName] = ehs;
  }
  if (typeof fn !== 'function') {
    console.warn(`Expect a function to bind "${eventName}" event, but got a ${typeof fn}`);
    return;
  }
  const eh = createEventHandler(fn, once, ctx || emitter);
  ehs[ehs.length] = eh;
}

export function addListeners(
  emitter: IEmitter,
  eventName: string | string[],
  fn: TEmitterListener,
  ctx: any,
  once: boolean,
): void {
  if (Array.isArray(eventName)) {
    eventName.forEach((n) => {
      const type = typeof n;
      if (type !== 'string') {
        console.warn(`Expect a string as event name, but got ${type} ${n}`);
      }
      addListener(emitter, n, fn, ctx, once);
    });
  }
  else {
    addListener(emitter, eventName, fn, ctx, once);
  }
}

export function removeListener(
  emitter: IEmitter,
  eventName: string,
  fn: TEmitterListener,
  once?: boolean
): void {
  const listeners = emitter._events[eventName];
  if (!listeners) {
    return;
  }
  const type = typeof fn;
  if (type !== 'function') {
    console.warn(`Expect a function to bind "${eventName}" event, but got a ${type}`);
    return;
  }
  emitter._events[eventName] = listeners.filter((listener) => {
    return listener.fn !== fn || (once && !listener.once);
  });
}

export function removeListeners(
  emitter: IEmitter,
  eventName: string | string[],
  fn: TEmitterListener
): void {
  if (Array.isArray(eventName)) {
    eventName.forEach((n) => {
      removeListener(emitter, n, fn, false);
    });
  }
  else {
    removeListener(emitter, eventName, fn, false);
  }
}

export function emit(
  emitter: IEmitter,
  eventType: string | IEventTypeArgs,
  cb: (fn: TEmitterListener, ctx: any, evt: IEmitterEvent) => void
): number {
  const evt = new EmitterEvent(eventType, emitter);
  const { type } = evt;

  const els = emitter._events[type];
  let i = 0;
  if (!els) {
    return i;
  }

  for (const len = els.length; i < len; i++) {
    const { fn, once, ctx } = els[i];

    // 只执行一次的情况
    if (once) {
      removeListener(emitter, type, fn, once);
    }
    // 执行事件回调函数
    cb(fn, ctx, evt);

    // 试图阻止当前事件广播
    if (evt.isImmediatePropagationStopped === false) {
      break;
    }
  }
  return i;
}

export class Emitter implements IEmitter {
  _events: IEventHandlers = Object.create(null);

  on(
    eventName: string | string[],
    fn: TEmitterListener,
    ctx?: any,
  ): this {
    addListeners(this, eventName, fn, ctx, false);
    return this;
  }

  once(
    eventName: string | string[],
    fn: TEmitterListener,
    ctx?: any,
  ): this {
    addListeners(this, eventName, fn, ctx, true);
    return this;
  }

  off(
    eventName: string | string[],
    fn: TEmitterListener,
  ): this {
    removeListeners(this, eventName, fn);
    return this;
  }

  emit(
    eventType: string | IEventTypeArgs
  ): number {
    return emit(this, eventType, (fn, ctx, evt) => {
      fn.call(ctx, evt);
    });
  }

  removeAllListeners(eventName?: string | string[]): this {
    const len = arguments.length;
    switch (len) {
      case 0:
        this._events = Object.create(null);
        break;
      case 1:
        if (Array.isArray(eventName)) {
          eventName.forEach((name) => {
            delete this._events[name];
          });
        }
        else {
          delete this._events[eventName as string];
        }
        break;
    }
    return this;
  }
}
