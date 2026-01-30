import { ReactNode, useReducer } from "react"
import { EventHandlersFromMap, HasNode, PickAndPrefixKeysAndCapitalise } from "@ns-lab-klx/types"
import { _t, SpatialNode, SpatialNode_UI, SpatialNodeEventsMap, SpatialNodeInput } from "@ns-lab-klx/logic"
import { _effect, _memo } from "../../utils"
import { reaction } from "mobx"

// ========================================
export type UseSpatialNodeEventsMap = {
    change: {
        spatialNode: SpatialNode
    }
}

// ========================================
export type UseSpatialNodeInput =
    & Pick<SpatialNodeInput,
        // | "onChange"
        | "isObservable"
    >
    & PickAndPrefixKeysAndCapitalise<"initial", SpatialNodeInput, | "size" | "position">
    & EventHandlersFromMap<UseSpatialNodeEventsMap>



// ========================================
/**
 * * will [_updateComponent] [onChange]
 */
export const useSpatialNode = ({
    initialSize
    , initialPosition
    , isObservable

    , onChange
}: UseSpatialNodeInput
) => {
    const { spatialNode } = _memo([], () => {
        return {
            spatialNode: new SpatialNode({
                size: initialSize
                , position: initialPosition
                , isObservable
            })
        }
    })

        , [_, _updateComponent] = useReducer(x => x + 1, 0)

    // could be replaced outside
    spatialNode.onChange = (ev) => {

        console.log(useSpatialNode.name, {
            "node.onChange": ev
            , spatialNode
        })

        _updateComponent()

        // debugger
        onChange?.({ spatialNode })

    }

    return {
        /**
         * * [SpatialNode] instance
         */
        spatialNode: spatialNode as SpatialNode_UI
    }

}