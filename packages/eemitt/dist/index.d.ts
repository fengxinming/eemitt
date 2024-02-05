import { IEmitter, IEvent, IEventListener, IEventTransports, IEventType } from './typings';
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
export * from './typings';
