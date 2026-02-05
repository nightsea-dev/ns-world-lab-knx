import {
    _use_state
    , PickHtmlAttributes
} from "../utils"


export type useOnPointerDownInput =
    & PickHtmlAttributes<"onPointerDown">

export const useOnPointerDown = ({
    onPointerDown
} = {} as useOnPointerDownInput
) => {

    type State = typeof state
    const [state, _set_state] = _use_state({
        pointerIsDown: false
    })


    return {
        ...state
        , onPointerDown: (ev) => {
            _set_state({
                pointerIsDown: true
            })
            onPointerDown?.(ev)
        }
        , onPointerUp: () => {
            _set_state({
                pointerIsDown: false
            })
        }
    } as
        & PickHtmlAttributes<"onPointerDown" | "onPointerUp">
        & State
}
