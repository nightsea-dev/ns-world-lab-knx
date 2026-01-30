import { KeyOf } from "@ns-lab-klx/types";
import { entriesOf } from "./entries-of.util";




export const pickFrom = <
    T extends object
    , K extends KeyOf<T>
>(
    o: T
    , ...keys: K[]
): Pick<T, K> => Object.fromEntries(
    entriesOf(o).filter(([k]) => keys.includes(k as K))
) as Pick<T, K>



    , omitFrom = <
        T extends object
        , K extends KeyOf<T>
    >(
        o: T
        , ...keys: K[]
    ): Omit<T, K> => Object.fromEntries(
        entriesOf(o).filter(([k]) => !keys.includes(k as K))
    ) as any as Omit<T, K>


