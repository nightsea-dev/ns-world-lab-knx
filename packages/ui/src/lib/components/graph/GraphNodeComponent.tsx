import { Rnd } from "react-rnd"
import {
    EventHandlersFromMap,
    HasChildren,
    KeyOf,
    PickRequiredRestPartial,
    PrefixProperties,
    PrefixPropertiesAndCapitalise,
    Transformation,
    XOR,
} from "@ns-lab-klx/types"
import { _cn, _effect, _memo, PickCssProperties, PickHtmlAttributes } from "../../utils"
import {
    HasGraphNodeContentContainer,
    GraphNodeContentContainer
    , GraphNodeContentContainerProps
} from "./GraphNodeContentContainer"
import {
    _t,
    SpatialNodeProps
} from "@ns-lab-klx/logic"
import { reaction } from "mobx"
import { ComponentProps, MouseEvent, MouseEventHandler, ReactNode, useId, useReducer } from "react"
import { useSpatialNode } from "../../hooks/"
import { CloseButton, CloseButtonProps } from "../ui"


// ======================================== props
type A =
    & PickRequiredRestPartial<
        & GraphNodeContentContainerProps
        & HasGraphNodeContentContainer
        , "content"
    >
type B = Required<
    & PickHtmlAttributes<"children">
>

type AorB = XOR<A, B>

type BaseGraphNodeComponentProps =
    & Pick<
        SpatialNodeProps,
        | "size"
        | "position"
        | "onChange"
        | "isObservable"
    >

    & PickHtmlAttributes<"className" | "style">
    & PickCssProperties<"backgroundColor">


    & AorB

    & Partial<
        & {
            onCloseButtonClick: CloseButtonProps["onClick"]
        }
    >

// --------------------------------------------------
export type GraphNodeComponentProps =
    & BaseGraphNodeComponentProps


// ======================================== component
// ======================================== component

export const GraphNodeComponent = ({
    content
    , size
    , position
    , isObservable = true
    , onChange

    , className
    , style
    , backgroundColor
    , contentContainer: _ContentContainer = GraphNodeContentContainer


    , children

    , onCloseButtonClick

    , ...rest

}: GraphNodeComponentProps
) => {

    const { node } = useSpatialNode({
        content
        , size
        , position
        , isObservable
        , onChange
    })

    
        // const { node } = _memo([content], () => {
        //     return {
        //         node: new GraphNode_BL({
        //             size
        //             , position
        //             , isObservable
        //             // , onChange
        //         })
        //     }
        // })

        //     , [_, _updateComponent] = useReducer(x => x + 1, 0)

        // node.onChange = (ev) => {

        //     const {
        //         k
        //         , node
        //     } = ev

        //     console.log(
        //         "node.onChange"
        //         , ev
        //     )

        //     debugger

        //     onChange?.(ev)

        // }

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
        //                 `${_t()} ${GraphNodeComponent.name}\n`
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

        //             onChange?.({
        //                 node
        //                 , k: "position"
        //             })

        //             _updateComponent()

        //         }
        //     )


        // })
    

    type RndProps = ComponentProps<typeof Rnd>
    type K = KeyOf<Pick<RndProps,
        | "onDragStart"
        | "onDrag"
        | "onDragStop"
        | "onResizeStop"
    >>
    const _handlers = {
        onDrag: (ev, data) => {

            console.log("onDrag", {
                ev, data
            })

        }

        , onDragStart: (ev, data) => {

            console.log("onDragStart", {
                ev, data
            })

        }

        , onDragStop: (ev, data) => {
            node.position = data
            console.log("onDragStop", {
                "node.position": node.position
                , ev, data
            })
        }

        , onResizeStop: (...args) => {

            const [e, dir, elementRef, delta, newPosition] = args

                , transformation: Transformation = {
                    size: {
                        width: node.size.width + delta.width
                        , height: node.transformation.size.height + delta.height
                    }
                    , position: newPosition
                }

            console.log("onResizeStop", {
                transformation
            })


            node.updateTransformation(transformation)

            // node.size = {
            //     width: node.size.width + delta.width
            //     , height: node.transformation.size.height + delta.height
            // }

            // node.position = newPosition

            // node.updateSize({
            //     width: node.size.width + delta.width
            //     , height: node.transformation.size.height + delta.height
            // })
            // node.updatePosition(newPosition)
            // node.updateSize(node.size.width + delta.width, node.transformation.size.height + delta.height)
            // node.updatePosition(newPosition.x, newPosition.y)
        }

    } as {
            [k in K]: NonNullable<RndProps[k]>
        }


    return (
        <Rnd
            {...rest}
            data-graph-node-component
            size={node.size}
            position={node.position}
            {..._handlers}
            bounds="parent"
            className={_cn(
                "border border-gray-300 p-2 hover:shadow-sm"
                , className
                , (onCloseButtonClick ? `p-r-2` : undefined)
            )}
            style={{
                ...style
                , backgroundColor
                , overflow: "hidden"
                , alignItems: "baseline"
            }}
        // style={{ background: node.color }}
        >
            {onCloseButtonClick
                && <CloseButton
                    onClick={onCloseButtonClick}
                />
            }
            {children ? children : (
                <_ContentContainer
                    content={content}
                />
            )}
        </Rnd>
    )
}

// <div className="flex flex-col justify-center items-center h-full w-full">
//     <div className="w-full text-center">
//         {node.payload}
//         {/* {node.content} */}
//     </div>
// </div>