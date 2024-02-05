# eemitt

> Event emitter for all engines.

## Installation

```bash
npm i eemitt --save
```

## Usage

```js
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

## Types

```ts
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
    on(eventName: string | string[], fn: IEventListener, ctx?: any): this;
    once(eventName: string | string[], fn: IEventListener, ctx?: any): this;
    off(eventName: string | string[], fn: IEventListener): this;
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
export declare class EEvent<T = unknown, U = Emitter> implements IEvent<T, U> {
    [key: string]: any;
    type: string;
    target: T;
    currentTarget: U;
    isImmediatePropagationStopped: boolean;
    constructor(eventType: string | IEventType, currentTarget: U);
    stopImmediatePropagation(): void;
    startImmediatePropagation(): void;
}
export declare class Emitter implements IEmitter {
    _events: IEventTransports;
    on(eventName: string | string[], fn: IEventListener<unknown, this>, ctx?: any): this;
    once(eventName: string | string[], fn: IEventListener<unknown, this>, ctx?: any): this;
    off(eventName: string | string[], fn: IEventListener<unknown, this>): this;
    emit(eventType: string | IEventType): number;
    removeAllListeners(eventName?: string | string[]): this;
}
```