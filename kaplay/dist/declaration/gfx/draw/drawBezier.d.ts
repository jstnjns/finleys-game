import { type Vec2 } from "../../math/math";
import { type DrawCurveOpt } from "./drawCurve";
export type DrawBezierOpt = DrawCurveOpt & {
    /**
     * The first point.
     */
    pt1: Vec2;
    /**
     * The the first control point.
     */
    pt2: Vec2;
    /**
     * The the second control point.
     */
    pt3: Vec2;
    /**
     * The second point.
     */
    pt4: Vec2;
};
export declare function drawBezier(opt: DrawBezierOpt): void;
//# sourceMappingURL=drawBezier.d.ts.map