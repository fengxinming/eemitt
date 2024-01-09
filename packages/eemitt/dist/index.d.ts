import { IEmitter, IEvent, IEventListener, IEventTransports, IEventType } from './typings';
export declare class EEvent<T> implements IEvent<T> {
    [key: string]: any;
    type: string;
    target: any;
    currentTarget: T;
    isImmediatePropagationStopped: boolean;
    constructor(eventType: string | IEventType, currentTarget: T);
    stopImmediatePropagation(): void;
    startImmediatePropagation(): void;
}
export declare class Emitter implements IEmitter {
    _events: IEventTransports<Emitter>;
    on(eventName: string | string[], fn: IEventListener<this>, meta?: any): this;
    once(eventName: string | string[], fn: IEventListener<this>, meta?: any): this;
    off(eventName: string | string[], fn: IEventListener<this>): this;
    emit(eventArgs: string | IEventType): number;
    removeAllListeners(eventName?: string | string[]): this;
}
export * from './typings';
