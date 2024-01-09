import { EventArgs, Eventer, EventHandlers, EventerListener } from './typings';
export declare class EmitterEventer<T> implements Eventer<T> {
    [key: string]: any;
    type: string;
    target: any;
    currentTarget: T;
    _isImmediatePropagationStopped: boolean;
    constructor(eventType: string | EventArgs, currentTarget: T);
    stopImmediatePropagation(): void;
    startImmediatePropagation(): void;
}
export declare class Emitter {
    _events: EventHandlers<Emitter>;
    on(eventName: string | string[], fn: EventerListener<this>, meta?: any): this;
    once(eventName: string | string[], fn: EventerListener<this>, meta?: any): this;
    off(eventName: string | string[], fn: EventerListener<this>): this;
    emit(eventArgs: string | EventArgs): number;
    removeAllListeners(eventName?: string | string[]): this;
}
export * from './typings';
export { Eventer as EmitterEvent };
