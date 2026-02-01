import { KeyOf } from "@ns-lab-knx/types";

export const keysOf = <T extends object>(o: T) =>
    Object.keys(o) as KeyOf<T>[]

