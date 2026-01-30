import { HasKind } from "../../capabilities"
import { KeyOf } from "../../ts"


export type EventHandler<
    E extends object
>
    = (ev: E) => void


export type EventHandlersFromMap<
    EvMap extends Record<string, object>
> = {
        [k in KeyOf<EvMap> as `on${Capitalize<k>}`]: EventHandler<EvMap[k]>
    }


export type PartialEventHandlersFromMap<
    EvMap extends Record<string, object>
> = EventHandlersFromMap<EvMap>




// ========================================
export type EventHandlersWithKindFromMap<
    EvMap extends Record<string, object>
> = {
        [k in KeyOf<EvMap> as `on${Capitalize<k>}`]: EventHandler<
            & EvMap[k]
            & {
                eventKind: k
            }
        >
    }


export type PartialEventHandlersWithKindFromMap<
    EvMap extends Record<string, object>
> = Partial<
    EventHandlersWithKindFromMap<EvMap>
>








