import React, { FunctionComponent, isValidElement, ReactElement, ReactNode, RefObject, useId, useReducer, useRef } from 'react'
import {
    _capitalise, _jitterPositions, _t
    , keysOf, pickFrom
} from "@ns-lab-knx/logic"
import {
    HasData
    , Position
    , Transformation
    , EventHandlersWithKindFromMap
    , PayloadWithKind,
    M_StateFromMap,
    HasHeader,
    HasBody,
    XOR,
    HasPayload,
    HasPayloadWithKind,
    HasEventKind,
    EventHandlersFromMap,
    KeyOf,
} from '@ns-lab-knx/types'

import {
    BoardSurfaceControlPanel
} from './BoardSurfaceControlPanel'

import {
    CreatePayloadFn
    , HasSurfaceNode, PayloadRenderer, PayloadRendererProps
    , SurfaceNode
    , SurfaceNodeComponent
    , SurfaceNodeProps
} from '../graph'
import { ButtonsMap, NoData, ObjectView } from '../ui'
import { _cb, _effect, _memo, _use_state } from '../../utils'
import { Button, ButtonToolbar, Drawer, DrawerProps, Modal } from 'rsuite'


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



// ======================================== types

export type SurfaceNodesMap<
    P extends PayloadWithKind<any>
> = Map<P, SurfaceNode<P>>

export type HasSurfaceNodesMap<
    P extends PayloadWithKind<any>
> = {
    nodesMap: SurfaceNodesMap<P>
}

// ======================================== types - M_STATES

type _Stage = "PROCESSING" | "DONE"
type _M_STATES_MAP<
    P extends PayloadWithKind<any>
> = {
    IDLE: {}
    "ADD PAYLOADS": {
        stage: _Stage
        addedPayloads?: P[]
    }
    "REMOVE PAYLOADS": {
        stage: _Stage
        removedPayloads?: P[]
        unableToRemovedPayloads?: P[]
    }
}

export type BoardSurfaceM_State<
    P extends PayloadWithKind<any>
> = M_StateFromMap<_M_STATES_MAP<P>>

// ======================================== state

/**
 * * [BoardSurface] only knows about [Payloads]
 */
export type BoardSurfaceState<
    P extends PayloadWithKind<any>
> =
    & {
        payloads: Set<P>
        surfaceNodesMap: Map<P, SurfaceNode<P>>
        numberOfItems: number
        m_state: BoardSurfaceM_State<P>
        showInfo: boolean
        isDisabled: boolean
    }

// ======================================== events
type _EventData<
    P extends PayloadWithKind<any>
> =
    & HasPayloadWithKind<P>
    & HasSurfaceNode<P>

type _BoardSurfaceEventBase<
    P extends PayloadWithKind<any>
> =
    & HasData<_EventData<P>[]>
    & {
        payloads: P[]
    }

type _NodesAddedEvent<
    P extends PayloadWithKind<any>
> =
    & _BoardSurfaceEventBase<P>
    & HasEventKind<"nodesAdded">
    & {
        addedPayloads: P[]
    }

type _NodesRemovedEvent<
    P extends PayloadWithKind<any>
> =
    & _BoardSurfaceEventBase<P>
    & HasEventKind<"nodesRemoved">
    & {
        removedPayloads: P[]
        unableToRemovedPayloads: P[]
    }


export type BoardSurfaceEventsMap<
    P extends PayloadWithKind<any>
> = {
    nodesAdded: _NodesAddedEvent<P>
    nodesRemoved: _NodesRemovedEvent<P>
    modalClose: {}
}

export type BoardSurfaceEventKind
    = KeyOf<BoardSurfaceEventsMap<any>>


export type BaseDrawerInfo =
    & HasHeader<ReactNode>
    & HasBody<ReactNode | FunctionComponent>



type DrawerInfo =
    XOR<
        ReactNode,
        BaseDrawerInfo
    >


export type BoardSurfaceHandleValue<
    P extends PayloadWithKind<any>
> = Readonly<
    Pick<BoardSurfaceState<P>,
        "numberOfItems"
        | "payloads"
        | "surfaceNodesMap"
    >
>

export type BoardSurfaceHandleRef<
    P extends PayloadWithKind<any>
> =
    RefObject<BoardSurfaceHandleValue<P> | undefined>

export const useBoardSurfaceHandleRef = <
    P extends PayloadWithKind<any>
>() => {
    return {
        ref: useRef<BoardSurfaceHandleValue<P> | undefined>(undefined)
    }
}

// ======================================== props
/**
 * * [BoardSurface] only knows about [Payloads]
 */
export type BoardSurfaceProps<
    P extends PayloadWithKind<any>
> =
    & Partial<
        & HasData<P[]>
        & {
            createPayloadFnMap: {
                [k: string]: CreatePayloadFn<P>
            }
            payloadRenderer: PayloadRenderer<P>
            additionalButtonsMap: ButtonsMap
            isDisabled: boolean
            // drawerInfo: Partial<DrawerInfo>
            showModalWithThisContent: ReactNode | FunctionComponent | BaseDrawerInfo

            handle: BoardSurfaceHandleRef<P>
        }

        & EventHandlersFromMap<
            BoardSurfaceEventsMap<P>
        >

        & Pick<
            SurfaceNodeProps<P>,
            | "children"
        >

    // & {
    //     additionalButtonsMap: ButtonsMap
    // }
    >



// ======================================== component
/**
 * * [BoardSurface] only knows about [Payloads]
 */
export const BoardSurfaceComponent = <
    P extends PayloadWithKind<any>
>({
    data: payloads_IN
    , createPayloadFnMap
    , additionalButtonsMap
    , payloadRenderer
    , children = payloadRenderer ?? DEFAULT.PayloadRenderer
    , handle
    , isDisabled: isDisabled_IN
    , showModalWithThisContent

    , onNodesAdded
    , onNodesRemoved
    , onModalClose

    , ...rest
}: BoardSurfaceProps<P>
) => {


    const id = useId()

        , [state, _set_state, _set_state_async] = _use_state({
            numberOfItems: 1
            , payloads: new Set()
            , m_state: {
                name: "IDLE"
            }
            , surfaceNodesMap: new Map()
            , showInfo: true
        } as BoardSurfaceState<P>
        )

        , _refs = useRef({
            el: undefined as undefined | HTMLElement | null
            // , surfaceNodesMap: new Map<P, SurfaceNode<P>>()
            , COUNTERS: {} as Record<string, number>
        })

        , {
            drawerInfo
        } = _memo([showModalWithThisContent], () => {

            if (!showModalWithThisContent) {
                return {}
            }

            const {
                header
                , body: B
            } = (
                isValidElement(showModalWithThisContent)
                    ? {
                        body: showModalWithThisContent
                    }
                    : typeof (showModalWithThisContent) === "function"
                        ? {
                            body: showModalWithThisContent
                        }
                        : showModalWithThisContent
            ) as BaseDrawerInfo

            return {
                drawerInfo: {
                    header
                    , body: typeof (B) === "function"
                        ? <B /> : B
                }
            }
        })

        ,
        /**
         * [_cb]
         */
        _getNextPosition = _cb((): Position | undefined => {
            const {
                current: {
                    el
                }
            } = _refs
                , {
                    transform: {
                        size: {
                            width: default_width
                            , height: default_height
                        }
                    }
                } = DEFAULT

            if (!el) {
                return
            }

            const {
                width: container_width
                , height: container_height
            } = el.getBoundingClientRect()

                , [x, y] = [
                    (container_width - default_width) / 2
                    , (container_height - default_height) / 2
                ].map(v => Math.max(0, v))

            // if (container_width <= 0) {
            //     debugger
            // }

            return { x, y } as Position

        })

        , _addPayloadAsync = _cb([
            _set_state_async
        ], async (
            kind: P["kind"]
        ) => {

            const {
                m_state
            } = await _set_state_async()

            if (m_state.name !== "IDLE") {
                return
            }

            if (
                !createPayloadFnMap
            ) {
                const err = new Error(`[createPayloadFnMap] is required.
        Unabled to [create/add] [payload].
        `)
                console.error(err)
                return
            }

            const {
                numberOfItems
                , payloads
            } = await _set_state_async({
                m_state: {
                    name: "ADD PAYLOADS"
                    , stage: "PROCESSING"
                }
            })
                , nextPayloads = [...payloads]
                , payloadsToAdd = Array.from({ length: numberOfItems })
                    .map(() => createPayloadFnMap[kind]())

            if (!payloadsToAdd.length) {
                debugger
                const err = new Error(`Something's wrong.
        [payloadToAdds] is EMPTY.
        `)
                console.error(err)
                return
            }

            /**
             * * nextPayloads
            */
            nextPayloads.push(...payloadsToAdd)
            _set_state_async({
                payloads: new Set(nextPayloads)
                , m_state: {
                    name: "ADD PAYLOADS"
                    , stage: "DONE"
                    , addedPayloads: payloadsToAdd
                }
            })

        })

        , _removePayloadAsync = async (
            ...payloadsToRemove: P[]
        ) => {

            const {
                m_state
            } = await _set_state_async()

            if (m_state.name !== "IDLE"
                || !payloadsToRemove.length
            ) {
                return
            }

            const {
                payloads
            } = await _set_state_async({
                m_state: {
                    name: "REMOVE PAYLOADS"
                    , stage: "PROCESSING"
                }
            })
                , nextPayloadsSet = new Set(payloads)
                , removedPayloads = [] as P[]
                , unableToRemovedPayloads = [] as P[]

            payloadsToRemove.forEach(payload => {
                ; (
                    nextPayloadsSet.delete(payload)
                        ? removedPayloads
                        : unableToRemovedPayloads
                ).push(payload)
            })

            const state_2 = await _set_state_async({
                payloads: removedPayloads.length
                    ? nextPayloadsSet
                    : payloads

                , m_state: {
                    name: "REMOVE PAYLOADS"
                    , removedPayloads
                    , unableToRemovedPayloads
                    , stage: "DONE"
                }
            })

            console.log({ state_2 })

        }
        , {
            keys
            , addItemButtonsMap
        } = _memo([createPayloadFnMap], () => {
            if (!createPayloadFnMap) {
                return {}
            }
            const keys = keysOf(createPayloadFnMap)
            return {
                keys
                , addItemButtonsMap: Object.fromEntries(
                    keys.map(k => [k, () => _addPayloadAsync(k)])
                )
            }
        })

        , _handleResetButtonClick
            = () => _removePayloadAsync(...state.payloads)

        , _handleCloseButtonClick: NonNullable<SurfaceNodeProps<P>["onCloseButtonClick"]>
            = ({ surfaceNode: { payload } }) => _removePayloadAsync(payload)

        , _handleLayoutButtonClick = _cb([
            state.surfaceNodesMap
        ], async () => {

            if (!_refs.current.el) {
                return
            }

            const {
                surfaceNodesMap
            } = state
                , {
                    width
                    , height
                } = _refs.current.el.getBoundingClientRect()
                , spatialNodes = [...surfaceNodesMap.values()].map(({ spatialNode }) => spatialNode)
                , positions = spatialNodes.map(({ position }) => position)
                , transformations = spatialNodes.map(({ transformation }) => transformation)
                , { jiterredPositions } = _jitterPositions({
                    containerSize: {
                        width
                        , height
                    }
                    , transformations
                })

            spatialNodes.forEach((spatialNode, i) => {
                spatialNode.updatePosition(
                    jiterredPositions[i]
                )
            })

        })

        , _handleSpatialNodeChange: NonNullable<SurfaceNodeProps<P>["onChange"]>
            = ({ eventKind, surfaceNode }) => {
                const {
                    surfaceNodesMap
                } = state

                    , {
                        current: {
                            COUNTERS
                        }
                    } = _refs
                    ; (COUNTERS[eventKind] ??= 0)
                COUNTERS[eventKind]++

                console.log(
                    _t()
                    , {
                        eventKind
                        , surfaceNode
                        , surfaceNodesMap
                        , COUNTER: COUNTERS[eventKind]
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

                const {
                    surfaceNodesMap
                    , payloads
                } = state

                surfaceNodesMap.set(
                    surfaceNode.payload
                    , surfaceNode
                )
                    ;
                ;[...surfaceNodesMap.entries()]
                    .forEach(([payloadID, node]) => {

                        if (!payloads.has(payloadID)) {
                            surfaceNodesMap.delete(payloadID)
                        }

                    })


                const {
                    current: {
                        COUNTERS
                    }
                } = _refs
                    ; (COUNTERS[eventKind] ??= 0)
                COUNTERS[eventKind]++

                console.log(
                    _t()
                    , {
                        eventKind
                        , surfaceNode
                        , surfaceNodesMap
                        , COUNTER: COUNTERS[eventKind]
                    })

            }


        , _getNodesFromPayloads = (
            ...payloads: P[]
        ) => {
            const {
                surfaceNodesMap
            } = state
            return payloads.map(payload => {
                return surfaceNodesMap.get(payload)!
            })
        }
        , _getEventData = (): _EventData<P>[] => {
            const {
                surfaceNodesMap
            } = state
            return [...surfaceNodesMap.entries()].map(([
                payload
                , surfaceNode
            ]) => ({
                payload
                , surfaceNode
            }))
        }
        , _handleModalClose = () => {
            _set_state({
                isDisabled: !state.isDisabled
            })
            onModalClose?.()
        }

    console.log(
        "HERE"
        , pickFrom(
            state
            , "payloads"
            , "surfaceNodesMap"
        )
    )




    _effect([
        handle
        , state.numberOfItems
        , state.payloads
        , state.surfaceNodesMap
    ], () => {
        if (!handle) {
            return
        }
        handle.current =
            pickFrom(
                state
                , "numberOfItems"
                , "payloads"
                , "surfaceNodesMap"
            )
    })

    const prevInRef = useRef<P[] | undefined>(undefined)

    _effect([payloads_IN], () => {

        if (
            !payloads_IN?.length
            || prevInRef.current === payloads_IN
        ) {
            return
        }

        prevInRef.current = payloads_IN

        _set_state({
            payloads: new Set(payloads_IN)
            , surfaceNodesMap: new Map()
        })
    })


    _effect([state.m_state], () => {
        switch (state.m_state.name) {
            case "IDLE": {
                return
            }
            case "ADD PAYLOADS": {
                const {
                    m_state: {
                        stage
                        , addedPayloads = []
                    }
                    , payloads: currentPayloads
                } = state
                if (stage !== "DONE") {
                    return
                }
                if (!addedPayloads.length
                    || !onNodesAdded
                ) {
                    break
                }
                onNodesAdded({
                    eventKind: "nodesAdded"
                    , addedPayloads
                    , data: _getEventData()
                    , payloads: [...currentPayloads]
                })
                break
            }
            case "REMOVE PAYLOADS": {
                const {
                    m_state: {
                        stage
                        , removedPayloads = []
                        , unableToRemovedPayloads = []
                    }
                    , surfaceNodesMap
                    , payloads: currentPayloads
                } = state

                if (stage !== "DONE") {
                    return
                }
                ;
                ;[...surfaceNodesMap.keys()]
                    .filter(p => !currentPayloads.has(p))
                    .forEach(p => {
                        surfaceNodesMap.delete(p)
                    })

                if (
                    !onNodesRemoved?.length
                    || !removedPayloads?.length
                ) {
                    break
                }

                onNodesRemoved({
                    eventKind: "nodesRemoved"
                    , data: _getEventData()
                    , removedPayloads
                    , unableToRemovedPayloads
                    , payloads: [...currentPayloads]
                })
                break
            }
        }

        _set_state({
            m_state: {
                name: "IDLE"
            }
        })

    })

    _effect([isDisabled_IN], () => {
        if (typeof (isDisabled_IN) !== "boolean"
            || state.isDisabled === isDisabled_IN
        ) {
            return
        }
        _set_state({
            isDisabled: isDisabled_IN
        })

    })

    console.log({
        "state.payloads": state.payloads
    })

    return (
        <div
            {...rest}
            id={id}
            className="h-full w-full flex flex-col relative"
            data-board-surface
            ref={el => {
                _refs.current.el = el
            }}
        >
            <Drawer
                open={state.isDisabled}
                className="items-center pointer-events-none"
                onClose={_handleModalClose}
                backdrop="static"
                centered
                placement='left'

            // keyboard={false}
            // size="full"
            // className="pointer-events-none"
            >
                <Drawer.Header>{drawerInfo?.header ?? "."}</Drawer.Header>
                {/* <Modal.Header>
                    <Modal.Title>.</Modal.Title>
                </Modal.Header> */}
                <Drawer.Body>{drawerInfo?.body ?? <NoData />}</Drawer.Body>

            </Drawer>

            {state.showInfo
                && <ObjectView
                    data={state}
                    showOnlyArrayLength
                    top={10}
                    left={10}
                    absolute
                />}

            <div
                data-payload-collection-container
                className="flex-1 relative w-full"
            >
                {[...state.payloads].map((payload, idx) => {

                    // debugger
                    return (
                        <SurfaceNodeComponent
                            key={payload.id}

                            payload={payload}
                            children={children}

                            initialSize={DEFAULT.transform.size}
                            initialPosition={_getNextPosition()}

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

            <BoardSurfaceControlPanel
                isDisabled={state.isDisabled}
                buttonsMap={{
                    ...addItemButtonsMap
                    , ...additionalButtonsMap
                    , Sort: {
                        onClick: _handleLayoutButtonClick
                        , disabled: !state.payloads.size
                    }
                    , Reset: {
                        onClick: _handleResetButtonClick
                        , disabled: !state.payloads.size
                    }
                }}
                {...pickFrom(state, "numberOfItems", "showInfo")}
                onChange={_set_state}
            />
        </div>
    )
}
