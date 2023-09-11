import { EventTypeArgs, IEmitter, IEmitterEvent, IEventHandlers, TEmitterListener } from './typings';
export declare class EmitterEvent implements IEmitterEvent {
    [key: string]: any;
    type: string;
    target: any;
    currentTarget: IEmitter;
    isImmediatePropagationStopped: boolean;
    constructor(eventType: string | EventTypeArgs, currentTarget: IEmitter);
    stopImmediatePropagation(): void;
}
export declare function addListener(emitter: IEmitter, eventName: string, fn: TEmitterListener, ctx: any, once: boolean): void;
export declare function addListeners(emitter: IEmitter, eventName: string | string[], fn: TEmitterListener, ctx: any, once: boolean): void;
export declare function removeListener(emitter: IEmitter, eventName: string, fn: TEmitterListener, once?: boolean): void;
export declare function removeListeners(emitter: IEmitter, eventName: string | string[], fn: TEmitterListener): void;
export declare function emit(emitter: IEmitter, eventType: string | EventTypeArgs, cb: (fn: TEmitterListener, ctx: any, evt: IEmitterEvent) => void): number;
export declare class Emitter implements IEmitter {
    _events: IEventHandlers;
    on(eventName: string | string[], fn: TEmitterListener, ctx?: any): this;
    once(eventName: string | string[], fn: TEmitterListener, ctx?: any): this;
    off(eventName: string | string[], fn: TEmitterListener): this;
    emit(eventType: string | EventTypeArgs): number;
    removeAllListeners(eventName?: string | string[]): this;
}
