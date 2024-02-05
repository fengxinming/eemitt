import { IEmitter, IEventListener } from './typings';
export declare function addListeners<T>(emitter: IEmitter, eventName: string | string[], fn: IEventListener<any, any>, once: boolean, ctx?: T): any;
export declare function removeListener(emitter: any, eventName: string, fn: IEventListener, once?: boolean): void;
export declare function removeListeners(emitter: IEmitter, eventName: string | string[], fn: IEventListener<any, any>): void;
