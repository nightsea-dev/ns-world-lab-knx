import React, { FunctionComponent, ReactElement, useId, useRef } from 'react'
import { _capitalise, createID, createIdeaWithAuthor, createPosition, createSize, entriesOf, getRandomColour, HasSpatialNode_UI, pickFrom, SpatialNode_UI } from "@ns-lab-klx/logic"
import {
    HasData
    , Position
    , Transformation
    , HasKind
    , KindBase
    , EventHandlersWithKindFromMap,
    PayloadWithKind,
} from '@ns-lab-klx/types'
import {
    _cn, _effect, _use_state
    , ObjectView
    , PayloadRendererProps
    , HasSurfacePayload
    , HasSurfacePayloadCollection
    , SurfaceNodeComponent
    , SurfaceNodeProps
    , HasPayloadRenderer
    , HasCreatePayloadFn,
    ButtonTw,
    SurfaceNodeEvent,
    SurfaceNode
} from "@ns-lab-klx/web"
import { Button, Input } from 'rsuite'
import { SurfaceButtonGroup } from './SurfaceButton'


// ======================================== CONSTS/DEFAULTS
const DEFAULT = {
    transform: {
        position: {
            x: 100 //+ prev.length * 20
            , y: 120
        }
        , size: {
            width: 200
            , height: 100
        }
    } as Transformation


    , PayloadRenderer: ({
        payload
    }: PayloadRendererProps<any>
    ) => (
        <ObjectView
            data={payload}
        />
    )

}


// const BoardSurfaceButton = (
//     props: React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>
// ) => {
//     return (
//         <button
//             {...props}
//             className={_cn(
//                 // "left-2 bottom-2 px-4 py-2 rounded absolute cursor-pointer"
//                 // , "text-[white] bg-[rgb(52, 152, 255)]"
//                 "absolute left-2 bottom-2 px-4 py-2 rounded cursor-pointer"
//                 , "bg-[#3498ff] !text-white"
//                 , props.className
//             )}
//         // onClick={_handleAddNodeButtonClick}
//         >
//             {/* Add {_capitalise(kind ?? "Item")} */}
//         </button>
//     )
// }



// ======================================== events

export type BoardSurfaceEventsMap<
    // K extends KindBase
    P extends PayloadWithKind<any>
> = {

    payloadsAdded:
    & HasSurfacePayloadCollection<P>
    & {
        addedPayloads: P[]
    }

    , payloadsRemoved:
    & HasSurfacePayloadCollection<P>
    & {
        removedPayloads: P[]
    }

}

// ======================================== state
export type BoardSurfaceState<
    P extends PayloadWithKind<any>
> =
    & HasSurfacePayloadCollection<P>
    & {
        numberOfItems: number
    }

// export type BoardSurfaceNodesMap<
//     P extends PayloadWithKind<any>
// > = Map<P, SurfaceNode<P>>

// export type BoardSurfaceHandle<
//     P extends PayloadWithKind<any>
// > = {
//     nodesMap: Map<P, SurfaceNode<P>>
// }


// ======================================== props
export type BoardSurfaceProps<
    P extends PayloadWithKind<any>
> =
    & Partial<
        & HasKind<P["kind"]>
        & HasData<P[]>
        & HasCreatePayloadFn<P>
        & HasPayloadRenderer<P>
        & EventHandlersWithKindFromMap<BoardSurfaceEventsMap<P["kind"]>>
    // & {
    //     handle: React.RefObject<BoardSurfaceHandle<P>>
    // }
    >



// ======================================== component
export const BoardSurface = <
    P extends PayloadWithKind<any>
>({
    kind
    , data: payload_IN
    , createPayloadFn
    , payloadRenderer: PayloadRenderer
    = DEFAULT.PayloadRenderer

    , onPayloadsAdded
    , onPayloadsRemoved

    // , handle

}: BoardSurfaceProps<P>
) => {

    // type K = P["kind"]

    // type Payload = SurfacePayload<K>

    const id = useId()

        , [state, _set_state] = _use_state({
            payloads: []
            , nodesMap: new Map()
            , numberOfItems: 1
        } as BoardSurfaceState<P>
        )

        , _refs = useRef({
            nodesMap: new Map<P, SurfaceNode<P>>()
        })

        , _getNextPosition = (): Position => {

            const {
                width: container_width
                , height: container_height
            } = document.getElementById(id)!.getBoundingClientRect()

                , {
                    transform: {
                        size: {
                            width: default_width
                            , height: default_height
                        }
                    }
                } = DEFAULT

            return {
                x: (container_width - default_width) / 2
                , y: (container_height - default_height) / 2
            } as Position

        }

        , _addPayload = (
            ...payloadsToAdd: P[]
        ) => {


            if (
                !payloadsToAdd.length
                &&
                !createPayloadFn
            ) {
                const err = new Error(`Unabled to [add] [payload].
Either [createPayloadFn] or [payloadToAdd] is required.
`)
                console.error(err)
                return
            }

            if (createPayloadFn
                && !payloadsToAdd.length
            ) {

                const {
                    numberOfItems: length
                } = state
                payloadsToAdd = Array.from({ length })
                    .map(() => createPayloadFn())
            }

            if (!payloadsToAdd.length) {
                debugger
                const err = new Error(`Something's wrong.
[payloadToAdds] is EMPTY.
`)
                console.error(err)
                return

            }

            const {
                payloads: current_payloads
            } = state

                , payloads = [...current_payloads]

            payloads.push(...payloadsToAdd)

            _set_state({ payloads })

            onPayloadsAdded?.({
                eventKind: "payloadsAdded"
                , addedPayloads: payloadsToAdd
                , payloads
            })

        }

        , _handleAddNodeButtonClick = () => {
            _addPayload()
        }
        , _handleReset = () => {
            const {
                payloads: removedPayloads
            } = state
            _set_state({
                payloads: []
            })
            onPayloadsRemoved?.({
                eventKind: "payloadsRemoved"
                , payloads: []
                , removedPayloads
            })
        }



        , _handleCloseButtonClick: SurfaceNodeProps<P>["onCloseButtonClick"]
            = ({
                surfaceNode: {
                    payload: payloadToRemove
                }
            }) => {

                debugger

                const {
                    payloads
                } = state

                    // , payloads = [...current_payloads]

                    , idx = payloads.findIndex(
                        payload => payload.id === payloadToRemove.id
                    )

                if (idx < 0) {
                    const error = Object.assign(
                        new Error(`[payloadToRemove.id: ${payloadToRemove.id}] not found in [state.items]`)
                        , {
                            payloadToRemove
                        }
                    )
                    console.warn(error)
                    return
                }

                const removedPayloads
                    = payloads.splice(idx, 1)

                _set_state({ payloads })

                onPayloadsRemoved?.({
                    eventKind: "payloadsRemoved"
                    , payloads
                    , removedPayloads
                })

                // const eq = payloadToRemove === removedPayload
                // console.log({
                //     payloadToRemove
                //     , removedPayload
                //     , eq
                // })

                // debugger
                // onPayloadRemoved?.({
                //     eventKind: "payloadRemoved"
                //     , payload: removedPayload
                //     , payloads
                // })

            }

        , _handleSpatialNodeChange: SurfaceNodeProps<P>["onChange"]
            = ({
                eventKind
                , surfaceNode
                , surfaceNode: {
                    payload
                    , spatialNode
                }
            }) => {

                console.log({
                    eventKind
                    , surfaceNode
                })

            }

        , _handleSpatialNodeMount: NonNullable<SurfaceNodeProps<P>["onMount"]>
            = ({
                eventKind
                , surfaceNode
                , surfaceNode: {
                    payload
                    , spatialNode
                }
            }) => {

                _refs.current.nodesMap.set(
                    surfaceNode.payload
                    , surfaceNode
                )
                console.log({
                    eventKind
                    , surfaceNode
                    , "boardSurfaceRef.current.nodesMap": _refs.current.nodesMap
                })

            }

    _effect([], () => {
        if (state.payloads.length) {
            return
        }
        /**
         * * add 1 - [KLX] base
         */
        _addPayload()
    })

    _effect([payload_IN], () => {
        if (!payload_IN || payload_IN === state.payloads) {
            return
        }
        _set_state({
            payloads: payload_IN
        })
    })


    return (
        <div
            id={id}
            className="h-full flex flex-col relative"
        >
            <div
                className={`
                    absolute top-0 left-0 
                    
                    rounded-[5px] 
                    px-3 py-1 m-0 
                    bg-gray-200
                    `}
            >
                items: {state.payloads.length}
            </div>
            <div
                data-payload-collection-container
                className="flex-1 relative w-[100%]"
            >
                {state.payloads.map(
                    (payload, i) => {

                        const initialPosition = _getNextPosition()

                        return (
                            <SurfaceNodeComponent//<P>
                                key={[payload.id, i].join("|")}

                                payload={payload}
                                payloadRenderer={PayloadRenderer}


                                initialSize={DEFAULT.transform.size}
                                initialPosition={initialPosition}
                                // initialPosition={DEFAULT.transform.position}

                                onCloseButtonClick={_handleCloseButtonClick}
                                onChange={_handleSpatialNodeChange}
                                onMount={_handleSpatialNodeMount}
                            >
                                {/* <PayloadRenderer
                                    payload={payload}
                                /> */}
                            </SurfaceNodeComponent>
                        )
                    })}
            </div>

            <SurfaceButtonGroup
                buttonsMap={{
                    [`Add ${_capitalise(kind ?? "Item")}`]: _handleAddNodeButtonClick
                    , Reset: _handleReset
                }}
                numberOfItems={state.numberOfItems}
                onChange={({ numberOfItems }) => _set_state({ numberOfItems })}
                onEnterKey={() => _addPayload()}
            />
        </div>
    )
}
