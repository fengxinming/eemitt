import { addListeners, removeListener, removeListeners } from './shared';
import { IEmitter, IEvent, IEventListener, IEventTransports, IEventType } from './typings';

export class EEvent<T = unknown, U = Emitter> implements IEvent<T, U> {
  [key: string]: any;

  type!: string;
  target: T;
  currentTarget: U;
  isImmediatePropagationStopped: boolean;

  constructor(eventType: string | IEventType, currentTarget: U) {
    this.target = currentTarget as any;
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

  startImmediatePropagation(): void {
    this.isImmediatePropagationStopped = true;
  }
}

export class Emitter implements IEmitter {
  _events: IEventTransports = Object.create(null);

  on(
    eventName: string | string[],
    fn: IEventListener<unknown, this>,
    ctx?: any,
  ): this {
    return addListeners(this, eventName, fn, false, ctx);
  }

  once(
    eventName: string | string[],
    fn: IEventListener<unknown, this>,
    ctx?: any,
  ): this {
    return addListeners(this, eventName, fn, true, ctx);
  }

  off(
    eventName: string | string[],
    fn: IEventListener<unknown, this>,
  ): this {
    removeListeners(this, eventName, fn);
    return this;
  }

  emit(eventType: string | IEventType): number {
    const evt = new EEvent(eventType, this);
    const { type } = evt;

    const currentListeners = this._events[type];
    let i = 0;

    if (!currentListeners) {
      return i;
    }

    const duplicates = currentListeners.slice(0);
    for (const len = duplicates.length; i < len; i++) {
      const { fn, once, ctx } = duplicates[i];

      // 只执行一次的情况
      if (once) {
        removeListener(this, type, fn, once);
      }

      // 执行事件回调函数
      fn.call(ctx === void 0 ? this : ctx, evt);

      // 试图阻止当前事件广播
      if (evt.isImmediatePropagationStopped === false) {
        break;
      }
    }
    return i;
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

export * from './typings';
