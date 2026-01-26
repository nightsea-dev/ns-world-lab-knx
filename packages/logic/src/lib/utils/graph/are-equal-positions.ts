import { Position, Position_KEYS } from "@ns-lab-klx/types";


export const areEqualPositions = (
    a: Position
    , b: Position
) => Position_KEYS.every(k => a[k] === b[k])