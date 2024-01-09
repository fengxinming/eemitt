import { IEventListener } from './typings';
export declare function addListeners<T>(emitter: T, eventName: string | string[], fn: IEventListener<T>, once: boolean, meta?: any): any;
export declare function removeListener<T>(emitter: any, eventName: string, fn: IEventListener<T>, once?: boolean): void;
export declare function removeListeners<T>(emitter: T, eventName: string | string[], fn: IEventListener<T>): void;
