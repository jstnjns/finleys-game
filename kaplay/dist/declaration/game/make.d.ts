import { type CompList, type GameObj } from "../types";
type MakeTypeIsFN<T, Chain = T> = T extends (go: GameObj) => infer R ? R : Chain;
type MakeTypeIsCLASS<T, Chain = T> = T extends new (go: GameObj) => infer R ? R : Chain;
type MakeType<T> = MakeTypeIsCLASS<T, MakeTypeIsFN<T>>;
export declare function make<T>(comps?: CompList<T>): GameObj<MakeType<T>>;
export {};
//# sourceMappingURL=make.d.ts.map