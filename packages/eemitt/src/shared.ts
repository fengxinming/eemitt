import { EventerListener, EventHandler } from './typings';

function addListener<T>(
  emitter: any,
  eventName: string,
  fn: EventerListener<T>,
  once: boolean,
  meta?: any
): void {
  let ehs = emitter._events[eventName] as Array<EventHandler<T>>;
  if (!ehs) {
    ehs = [];
    emitter._events[eventName] = ehs;
  }
  const type = typeof fn;
  if (type !== 'function') {
    console.warn(`Expect a function to bind "${eventName}" event, but got ${type} ${fn}`);
    return;
  }
  ehs[ehs.length] = { fn, once, meta };
}

export function addListeners<T>(
  emitter: T,
  eventName: string | string[],
  fn: EventerListener<T>,
  once: boolean,
  meta?: any
): any {
  if (Array.isArray(eventName)) {
    eventName.forEach((n) => {
      const type = typeof n;
      if (type !== 'string') {
        console.warn(`Expect a string as event name, but got ${type} ${n}`);
      }
      addListener(emitter, n, fn, once, meta);
    });
  }
  else {
    addListener(emitter, eventName, fn, once, meta);
  }
  return emitter;
}

export function removeListener<T>(
  emitter: any,
  eventName: string,
  fn: EventerListener<T>,
  once?: boolean
): void {
  const listeners = emitter._events[eventName] as Array<EventHandler<T>>;
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

export function removeListeners<T>(
  emitter: T,
  eventName: string | string[],
  fn: EventerListener<T>
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

