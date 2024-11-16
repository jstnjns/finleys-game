import { Vec2 } from "../../math/math";
import { type Graph } from "../../math/navigation";
import type { Comp } from "../../types";
export interface NavigationMapComp extends Comp {
    navigate(origin: Vec2, target: Vec2, navigationOpt: any): Vec2[] | undefined;
    graph: Graph | undefined;
}
export interface NavigationMapCompOpt {
    graph?: Graph;
}
export declare function navigationMap(opts: NavigationMapCompOpt): NavigationMapComp;
export interface NavigationComp extends Comp {
    navigateTo(target: Vec2): Vec2[] | undefined;
    graph: Graph | undefined;
}
export interface NavigationCompOpt {
    graph?: Graph;
    navigationOpt?: any;
}
export declare function navigation(opts: NavigationCompOpt): NavigationComp;
//# sourceMappingURL=navigation.d.ts.map