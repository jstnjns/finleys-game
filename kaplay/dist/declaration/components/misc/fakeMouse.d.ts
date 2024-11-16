import type { Comp } from "../../types";
/**
 * The {@link fakeMouse `fakeMouse()`} component.
 */
export interface FakeMouseComp extends Comp {
    /**
     * Whether the fake mouse is pressed.
     */
    get isPressed(): boolean;
    /**
     * Trigger press (onClick).
     */
    press(): void;
    /**
     * Trigger release.
     */
    release(): void;
    /**
     * Register an event that runs when the fake mouse performs a click.
     */
    onPress(action: () => void): void;
    /**
     * Register an event that runs when the fake mouse releases.
     */
    onRelease(action: () => void): void;
}
/**
 * Options for the {@link fakeMouse `fakeMouse()`} component.
 */
export type FakeMouseOpt = {
    /**
     * Whether the fake mouse should follow the real mouse. Defaults to `true`.
     */
    followMouse?: boolean;
};
export declare const fakeMouse: (opt?: FakeMouseOpt) => FakeMouseComp;
//# sourceMappingURL=fakeMouse.d.ts.map