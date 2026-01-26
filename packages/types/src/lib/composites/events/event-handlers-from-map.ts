import { KeyOf } from "../../ts";


export type EventHandler<
    E extends object
>
    = (ev: E) => void


export type EventHandlersFromMap<
    EvMap extends Record<string, object>
> = {
        [k in KeyOf<EvMap> as `on${Capitalize<k>}`]: EventHandler<EvMap[k]>
    }