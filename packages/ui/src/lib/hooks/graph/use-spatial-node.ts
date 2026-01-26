import { HasContent } from "@ns-lab-klx/types"
import { _t, areEqualPositions, SpatialNode, SpatialNodeProps } from "@ns-lab-klx/logic"
import { _effect, _memo } from "../../utils"
import { ReactNode, useReducer } from "react"
import { reaction } from "mobx"

// ========================================
export type UseSpatialNodeInput =
    & HasContent<ReactNode>
    & Pick<SpatialNodeProps, "size" | "position" | "onChange" | "isObservable">


// ========================================
export const useSpatialNode = ({
    content
    , size
    , position
    , isObservable
    , onChange
}: UseSpatialNodeInput
) => {

    const { node } = _memo([content], () => {
        return {
            node: new SpatialNode({
                size
                , position
                , isObservable
                // , onChange
            })
        }
    })

        // do we need to [_updateComponent] ?
        , [_, _updateComponent] = useReducer(x => x + 1, 0)


    node.onChange = (ev) => {

        console.log(useSpatialNode.name, { "node.onChange": ev })
        _updateComponent()

        debugger
        onChange?.(ev)

    }

    // _effect([node], () => {

    //     return reaction(
    //         (...args) => {
    //             const {
    //                 position
    //                 // ,position: { x, y }
    //             } = node
    //             return position //({ x, y } as Position)
    //         }
    //         , (previous, current) => {

    //             const eq = areEqualPositions(
    //                 node.position
    //                 , current
    //             )

    //             console.log(
    //                 `${_t()} ${useSpatialNode.name}\n`
    //                 , {
    //                     previous
    //                     , current
    //                     , eq
    //                 })
    //             // updating the [observable-node] will trigger the same [reaction]
    //             // node.updatePosition(x, y)

    //             if (!eq) {
    //                 debugger

    //             }

    //             // node.onChange?.({
    //             //     node
    //             //     , k: "position"
    //             // })

    //             _updateComponent()

    //         }
    //     )


    // })

    return { node }

}