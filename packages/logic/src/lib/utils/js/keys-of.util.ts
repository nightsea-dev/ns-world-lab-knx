import { KeyOf } from "@ns-lab-knx/types";

export const keysOf = <
    T extends object
>(o: T) => Object.keys(o) as KeyOf<T>[]


export const valuesOf = <
    T extends object
>(o: T): (T[KeyOf<T>])[] =>
    Object.entries(o) as (T[KeyOf<T>])[]

