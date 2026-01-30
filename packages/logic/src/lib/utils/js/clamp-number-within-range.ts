export type Range = [min: number, max: number]
export const clampNumberWithinRange = (
    n: number
    , range = [0, 1] as Range
) => Math.max(0, Math.min(100, n))
