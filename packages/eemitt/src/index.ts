import { addListeners, removeListener, removeListeners } from './shared';
import { IEmitter, IEvent, IEventListener, IEventTransport, IEventTransports, IEventType } from './typings';

export class EEvent<T> implements IEvent<T> {
  [key: string]: any;

  type!: string;
  target: any;
  currentTarget: T;
  isImmediatePropagationStopped: boolean;

  constructor(eventType: string | IEventType, currentTarget: T) {
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

  startImmediatePropagation(): void {
    this.isImmediatePropagationStopped = true;
  }
}

export class Emitter implements IEmitter {
  _events: IEventTransports<Emitter> = Object.create(null);

  on(
    eventName: string | string[],
    fn: IEventListener<this>,
    meta?: any,
  ): this {
    return addListeners(this, eventName, fn, false, meta);
  }

  once(
    eventName: string | string[],
    fn: IEventListener<this>,
    meta?: any,
  ): this {
    return addListeners(this, eventName, fn, true, meta);
  }

  off(
    eventName: string | string[],
    fn: IEventListener<this>,
  ): this {
    removeListeners(this, eventName, fn);
    return this;
  }

  emit(eventArgs: string | IEventType): number {
    const evt = new EEvent(eventArgs, this);
    const { type } = evt;

    const els = this._events[type] as Array<IEventTransport<this>>;
    let i = 0;

    if (!els) {
      return i;
    }

    for (const len = els.length; i < len; i++) {
      const { fn, once, meta } = els[i];

      // 只执行一次的情况
      if (once) {
        removeListener(this, type, fn, once);
      }

      // 执行事件回调函数
      fn.call(this, evt, meta);

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
