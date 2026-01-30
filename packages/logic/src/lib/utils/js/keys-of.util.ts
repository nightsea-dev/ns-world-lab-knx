import { KeyOf } from "@ns-lab-klx/types";

export const keysOf = <T extends object>(o: T) =>
    Object.keys(o) as KeyOf<T>[]

