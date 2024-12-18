import type { TimerComp } from "../components";
import { Mat4, Vec2 } from "../math/math";
import { type GameObj, type Key, type MouseButton } from "../types";
import { KEventHandler } from "../utils";
import type { GameObjEventMap } from "./events";
import type { SceneDef, SceneName } from "./scenes";
export type Game = ReturnType<typeof initGame>;
export declare const initGame: () => {
    events: KEventHandler<{
        mouseMove: [];
        mouseDown: [MouseButton];
        mousePress: [MouseButton];
        mouseRelease: [MouseButton];
        charInput: [string];
        keyPress: [Key];
        keyDown: [Key];
        keyPressRepeat: [Key];
        keyRelease: [Key];
        touchStart: [Vec2, Touch];
        touchMove: [Vec2, Touch];
        touchEnd: [Vec2, Touch];
        gamepadButtonDown: [string];
        gamepadButtonPress: [string];
        gamepadButtonRelease: [string];
        gamepadStick: [string, Vec2];
        gamepadConnect: [Gamepad];
        gamepadDisconnect: [Gamepad];
        scroll: [Vec2];
        add: [GameObj];
        destroy: [GameObj];
        load: [];
        loading: [number];
        error: [Error];
        input: [];
        frameEnd: [];
        resize: [];
        sceneLeave: [string];
    }>;
    objEvents: KEventHandler<GameObjEventMap>;
    root: GameObj<TimerComp>;
    gravity: Vec2 | null;
    scenes: Record<SceneName, SceneDef>;
    currentScene: SceneName | null;
    layers: string[] | null;
    defaultLayerIndex: number;
    logs: {
        msg: string | {
            toString(): string;
        };
        time: number;
    }[];
    cam: {
        pos: Vec2 | null;
        scale: Vec2;
        angle: number;
        shake: number;
        transform: Mat4;
    };
};
//# sourceMappingURL=game.d.ts.map