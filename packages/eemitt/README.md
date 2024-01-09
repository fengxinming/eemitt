# eemitt
> Event emitter for all engines.

```ts
import { Emitter } from 'eemitt'

const emitter = new Emitter()

// listen to an event
emitter.on('foo', (e, data) => console.log('foo', e, data))
emitter.once('foo', (e, data) => console.log('foo', e, data))

// fire an event
emitter.emit('foo')
emitter.emit({ type: 'foo', a: 'b' })

// clearing all event of 'foo'
emitter.removeAllListeners('foo')

// clearing all events
emitter.removeAllListeners()

// working with handler references:
function onFoo() {}
emitter.on('foo', onFoo)   // listen
emitter.off('foo', onFoo)  // unlisten
```

```ts
export interface IEventType {
  [key: string]: any;
  type: string;
}

export interface IEvent<T> {
  [key: string]: any;

  type: string;
  target: any;
  currentTarget: T;
  isImmediatePropagationStopped: boolean;
  stopImmediatePropagation(): void;
  startImmediatePropagation(): void;
}

export interface IEmitter {
  on(
    eventName: string | string[],
    fn: IEventListener<this>,
    meta?: any,
  ): this;

  once(
    eventName: string | string[],
    fn: IEventListener<this>,
    meta?: any,
  ): this;

  off(
    eventName: string | string[],
    fn: IEventListener<this>,
  ): this;

  emit(eventArgs: string | IEventType): number;

  removeAllListeners(eventName?: string | string[]): this;
}

export type IEventListener<T> = (evt: IEvent<T>, meta?: any) => any;

export interface IEventTransport<T> {
  fn: IEventListener<T>;
  once: boolean;
  meta: any | undefined;
}

export interface IEventTransports<T> {
  [eventName: string]: Array<IEventTransport<T>>;
}
```