import {
    _effect
    , BoardSurfaceProps
    , BoardSurfaceComponent,
    HasCreatePayloadFn,
    _memo,
    _use_state,
    PayloadRenderer,
    ObjectView,
    BoardSurfaceHandleValue,
    BoardSurfaceHandleRef,
    useBoardSurfaceHandleRef,
    BaseDrawerInfo
} from '@ns-lab-knx/web'
import {
    createID,
    createIdeaWithAuthor,
    createImageWithKind,
} from "@ns-lab-knx/logic"
import { IFrameWithKind, PickRestPartial } from '@ns-lab-knx/types'
import {
    _getFileTypeUrl,
    IdeaPayloadRenderer
    , IFramePayloadRenderer
    , ImageUploader, ImageUploaderProps, ImagePayloadRenderer,
    IFrameInputView,
    IFrameInputViewProps,
    IFrameDataItem
} from '../../../components'
import { ComponentProps, useRef } from 'react'
import { FileType, Header } from 'rsuite'

// ======================================== helpers
const _fromFileTypeToImageWithKind = (
    {
        blobFile
        , fileKey
        , name
        , progress
        , status
        , url
    }: FileType
) => !blobFile
        ? undefined
        : createImageWithKind({
            file: blobFile
            , src: _getFileTypeUrl(blobFile)!
            , name: blobFile.name
        })

    , _fromIFrameDataItemToIFrameWithKind = ({
        id = createID()
        , name
        , url: src
    }: PickRestPartial<IFrameDataItem, "name" | "url">
    ) => {
        return ({
            id
            , kind: "iframe"
            , name
            , src
        } as IFrameWithKind)
    }

// ======================================== CONST
const KNOWN_PAYLOAD_RENDERERS_MAP = {
    IdeaPayloadRenderer
    , IFramePayloadRenderer
    , ImagePayloadRenderer
}
type KNOWN_PAYLOAD_RENDERERS_MAP = typeof KNOWN_PAYLOAD_RENDERERS_MAP
type KnownPayloadRendererKey = keyof KNOWN_PAYLOAD_RENDERERS_MAP
type KnownPayloadRenderer = KNOWN_PAYLOAD_RENDERERS_MAP[KnownPayloadRendererKey]
type KnownPayload = ComponentProps<KnownPayloadRenderer>["payload"]

type KnownPayloadKind = KnownPayload["kind"]
type KnownPayloadOf<
    K extends KnownPayloadKind
> = Extract<KnownPayload, { kind: K }>

type KNOWN_PAYLOAD_RENDERERS_BY_KIND = {
    [R in KnownPayloadRenderer as ComponentProps<R>["payload"]["kind"]]: R
}

const KNOWN_PAYLOAD_RENDERERS_BY_KIND = {
    idea: IdeaPayloadRenderer
    , iframe: IFramePayloadRenderer
    , image: ImagePayloadRenderer
} as KNOWN_PAYLOAD_RENDERERS_BY_KIND


type M_State =
    | {
        name: "IDLE"
    }
    | {
        name: "IFRAME"
        status: "showing IFRAME input"
    }
    | {
        name: "IMAGE"
        status: "showing IMAGE input"
    }

type State =
    & {
        payloads: KnownPayload[]
        isFirstRender: boolean
        m_state: M_State
    }
// & Pick<BoardSurfaceProps<KnownPayload>, "showModalWithThisContent">


// ======================================== props
export type KnownPayloadsBoardProps =
    & Partial<
        & Pick<
            BoardSurfaceProps<KnownPayload>,
            | "data"
            | "onNodesAdded"
            | "onNodesRemoved"
        >
    >
// ======================================== component

export const KnownPayloadsBoard = ({
    data: data_IN
    , ...rest
}: KnownPayloadsBoardProps
) => {

    const [state, _set_state] = _use_state({
        payloads: []
        , isFirstRender: true
        , m_state: { name: "IDLE" }
    } as State)

        , {
            ref: _boardSurfaceHandleRef
        } = useBoardSurfaceHandleRef<KnownPayload>()


        , _handleButtonClick = (
            kind: KnownPayloadKind
        ) => {

            if (state.m_state.name !== "IDLE") {
                return
            }

            switch (kind) {
                case "idea": {

                    const {
                        payloads: data
                    } = state
                        , {
                            current: {
                                numberOfItems = 1
                            } = {}
                        } = _boardSurfaceHandleRef ?? {}
                    data.push(
                        ...(
                            Array.from({
                                length: Math.max(1, numberOfItems)
                            })
                                .map(() => createIdeaWithAuthor())
                        ))
                    _set_state({
                        payloads: [...data]
                    })
                    break
                }
                case "iframe": {
                    _set_state({
                        m_state: {
                            name: "IFRAME"
                            , status: "showing IFRAME input"
                        }
                    })
                    break
                }
                case "image": {
                    _set_state({
                        m_state: {
                            name: "IMAGE"
                            , status: "showing IMAGE input"
                        }
                    })
                    break;
                }
            }

        }

        , _handleModalClose = () => {
            _set_state({
                m_state: {
                    name: "IDLE"
                }
                // , drawerInfo: undefined
            })
        }
        , _handleImageInput: ImageUploaderProps["onDone"] = ({
            fileList
        }) => {

            if (!fileList.length) {
                return
            }
            const {
                payloads
            } = state
            payloads.push(
                ...fileList.map(o => _fromFileTypeToImageWithKind(o)!)
                    .filter(Boolean)
            )
            _set_state({
                payloads: [...payloads]
            })

        }
        
        , _handleIFrameInput: IFrameInputViewProps["onDone"] = ({
            data
        }) => {

            if (!data.length) {
                return
            }

            const {
                payloads
            } = state

            payloads.push(
                ...data
                    .map(_fromIFrameDataItemToIFrameWithKind)
                    .filter(Boolean)
            )

            _set_state({
                payloads: [...payloads]
            })

        }

        , _handleChange = ({
            payloads
        }: { payloads: KnownPayload[] }
        ) => {
            _set_state({ payloads })
        }

        , boardSurfaceIsDisabled
            = state.m_state.name === "IFRAME"
            || state.m_state.name === "IMAGE"

        , showModalWithThisContent = (() => {
            switch (state.m_state.name) {
                case "IFRAME": {
                    return ({
                        body: (<IFrameInputView
                            onDone={_handleIFrameInput}
                            onCancel={_handleModalClose}
                        />)
                    } as BaseDrawerInfo)
                }
                case "IMAGE": {
                    return ({
                        body: (
                            <ImageUploader
                                onDone={_handleImageInput}
                                onCancel={_handleModalClose}
                            />)
                        , header: (
                            <div
                                className='text-2xl'
                            >Add Images</div>)
                    } as BaseDrawerInfo)
                }
            }
        })()

    _effect([data_IN], () => {
        if (!data_IN || data_IN === state.payloads) {
            return
        }
        _set_state({
            payloads: data_IN
        })
    })

    _effect([], () => {

        if (!state.isFirstRender || state.payloads.length) {
            return
        }

        _set_state({
            payloads: [createIdeaWithAuthor()]
            , isFirstRender: false
        })

    })





    return (
        <div
            className={`
                h-full w-full relative 
                ---border-4                 
                ---border-amber-600 m-0
                `}
            data-known-payload-board
        >
            <ObjectView
                header="data-known-payload-board"
                data={state.m_state}
                showOnlyArrayLength
                top={10}
                right={10}
                absolute
            />
            <BoardSurfaceComponent<KnownPayload>
                {...rest}
                data={state.payloads}
                additionalButtonsMap={{
                    "Add Idea": () => _handleButtonClick("idea")
                    , "Add IFrame": () => _handleButtonClick("iframe")
                    , "Add Image": () => _handleButtonClick("image")
                }}
                handle={_boardSurfaceHandleRef}
                isDisabled={boardSurfaceIsDisabled}
                onModalClose={_handleModalClose}
                showModalWithThisContent={showModalWithThisContent}
                onNodesAdded={_handleChange}
                onNodesRemoved={_handleChange}
            >
                {({
                    payload
                    , payload: {
                        kind
                    }
                }) => {
                    if (!kind) {
                        const error = Object.assign(
                            new Error("[kind] is Required")
                            , { payload }
                        )
                        console.error(error)
                        throw error
                    }
                    const R = KNOWN_PAYLOAD_RENDERERS_BY_KIND[kind] as PayloadRenderer<KnownPayload>
                    return <R
                        payload={payload as KnownPayload}
                    />
                }}
            </BoardSurfaceComponent>
        </div>
    )

}

