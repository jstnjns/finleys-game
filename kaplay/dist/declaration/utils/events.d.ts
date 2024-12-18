export declare class Registry<T> extends Map<number, T> {
    private lastID;
    push(v: T): number;
    pushd(v: T): () => void;
}
/**
 * A controller for all events in KAPLAY.
 *
 * @example
 * ```js
 * // Create a new event
 * const logHi = onUpdate(() => {
 *    debug.log("hi");
 * });
 *
 * // Pause the event
 * logHi.paused = true;
 *
 * // Cancel the event
 * logHi.cancel();
 *
 * ```
 * @group Events
 */
export declare class KEventController {
    /** If the event is paused */
    paused: boolean;
    /** Cancel the event */
    readonly cancel: () => void;
    constructor(cancel: () => void);
    static join(events: KEventController[]): KEventController;
}
export declare class KEvent<Args extends any[] = any[]> {
    private handlers;
    add(action: (...args: Args) => void): KEventController;
    addOnce(action: (...args: (Args | PromiseLike<Args>)[]) => void): KEventController;
    next(): Promise<Args>;
    trigger(...args: Args): void;
    numListeners(): number;
    clear(): void;
}
export declare class KEventHandler<EventMap extends Record<string, any[]>> {
    private handlers;
    registers: Partial<{
        [Name in keyof EventMap]: Registry<(...args: EventMap[Name]) => void>;
    }>;
    on<Name extends keyof EventMap>(name: Name, action: (...args: EventMap[Name]) => void): KEventController;
    onOnce<Name extends keyof EventMap>(name: Name, action: (...args: EventMap[Name]) => void): KEventController;
    next<Name extends keyof EventMap>(name: Name): Promise<unknown>;
    trigger<Name extends keyof EventMap>(name: Name, ...args: EventMap[Name]): void;
    remove<Name extends keyof EventMap>(name: Name): void;
    clear(): void;
    numListeners<Name extends keyof EventMap>(name: Name): number;
}
//# sourceMappingURL=events.d.ts.map