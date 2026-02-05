import { HasKind } from "../../capabilities"
import { KeyOf } from "../../ts"


type BaseEventHandler<
    E extends object
>
    = (ev: E) => void

export type EventHandler<
    E extends object
>
    = E extends object
    ? (
        KeyOf<E> extends never
        ? () => void
        : BaseEventHandler<E>
    )
    : BaseEventHandler<E>

export type HasEventHandler<
    Sx extends string
    , E extends object
> = {
        [k in `on${Capitalize<Sx>}`]: EventHandler<E>
    }



export type EventHandlersFromMap<
    EvMap extends Record<string, object>
> = {
        [k in KeyOf<EvMap> as `on${Capitalize<k>}`]: EventHandler<EvMap[k]>
    }


export type PartialEventHandlersFromMap<
    EvMap extends Record<string, object>
> = EventHandlersFromMap<EvMap>




// ========================================

export type HasEventKind<
    K extends any = unknown
> = {
    eventKind: K
}

export type EventHandlersWithKindFromMap<
    EvMap extends Record<string, object>
> = {
        [k in KeyOf<EvMap> as `on${Capitalize<k>}`]: EventHandler<
            & EvMap[k]
            & HasEventKind<k>
        >
    }


export type PartialEventHandlersWithKindFromMap<
    EvMap extends Record<string, object>
> = Partial<
    EventHandlersWithKindFromMap<EvMap>
>








