import { Position, Position_KEYS } from "@ns-lab-knx/types";


export const areEqualPositions = (
    a: Position
    , b: Position
) => Position_KEYS.every(k => a[k] === b[k])