export interface IEventTypeArgs {
    [key: string]: any;
    type: string;
}
export interface IEmitterEvent {
    [key: string]: any;
    type: string;
    target: any;
    currentTarget: IEmitter;
    isImmediatePropagationStopped: boolean;
    stopImmediatePropagation(): void;
}
export interface IEmitter {
    _events: IEventHandlers;
    on(eventName: string | string[], fn: TEmitterListener, ctx?: any): this;
    once(eventName: string | string[], fn: TEmitterListener, ctx?: any): this;
    off(eventName: string | string[], fn: TEmitterListener): this;
    removeAllListeners(eventName?: string | string[]): this;
    emit(eventType: IEventTypeArgs): number;
}
export type TEmitterListener = (evt: IEmitterEvent) => any;
export interface IEventHandler {
    fn: TEmitterListener;
    once: boolean;
    ctx: any;
}
export interface IEventHandlers {
    [eventName: string]: IEventHandler[];
}
