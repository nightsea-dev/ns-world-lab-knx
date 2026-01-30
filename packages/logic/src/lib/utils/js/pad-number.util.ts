import { clampNumberWithinRange } from "./clamp-number-within-range";

export const padNumber = (
    n: number
    , digits = 2
) => n.toString().padStart(
    clampNumberWithinRange(digits, [0, 100])
    , '0')
