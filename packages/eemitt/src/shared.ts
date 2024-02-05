import { IEmitter, IEventListener, IEventTransport } from './typings';

function addListener<T>(
  emitter: IEmitter,
  eventName: string,
  fn: IEventListener,
  once: boolean,
  ctx?: T
): void {
  let ehs = emitter._events[eventName];
  if (!ehs) {
    ehs = [];
    emitter._events[eventName] = ehs;
  }
  const type = typeof fn;
  if (type !== 'function') {
    console.warn(`Expect a function to bind "${eventName}" event, but got ${type} ${fn}`);
    return;
  }
  ehs[ehs.length] = { fn, once, ctx };
}

export function addListeners<T>(
  emitter: IEmitter,
  eventName: string | string[],
  fn: IEventListener<any, any>,
  once: boolean,
  ctx?: T
): any {
  if (Array.isArray(eventName)) {
    eventName.forEach((n) => {
      const type = typeof n;
      if (type !== 'string') {
        console.warn(`Expect a string as event name, but got ${type} ${n}`);
      }
      addListener(emitter, n, fn, once, ctx);
    });
  }
  else {
    addListener(emitter, eventName, fn, once, ctx);
  }
  return emitter;
}

export function removeListener(
  emitter: any,
  eventName: string,
  fn: IEventListener,
  once?: boolean
): void {
  const listeners = emitter._events[eventName] as IEventTransport[];
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
  fn: IEventListener<any, any>
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
