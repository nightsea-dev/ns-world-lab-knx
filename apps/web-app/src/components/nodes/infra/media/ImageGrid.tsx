import { HasData, ImageWithKind, HasPartialData, EventHandlersFromMap, EventHandlersWithKindFromMap, HasName, HasEventKind } from "@ns-lab-knx/types"
import { _effect, _use_state, NoData } from "@ns-lab-knx/web"
import { ReactNode, useReducer } from "react"
import { Button, Input } from "rsuite"
import { pickFrom } from "@ns-lab-knx/logic"
import { ImageRenderer, ImageRendererEvent, ImageRendererEventsMap } from "./ImageRenderer"




export type ImageGridEventKind =
    | keyof ImageRendererEventsMap
    | "remove"

export type ImageGridEvent =
    & HasData<ImageWithKind>
    & HasEventKind<ImageGridEventKind>
    & {
        idx: number
    }

export type ImageGridEventsMap = {
    change: ImageGridEvent
}



export type ImageGridProps =
    Partial<
        & HasData<ImageWithKind[]>
        & EventHandlersFromMap<ImageGridEventsMap>
        & {
            noData: ReactNode
        }
    >

export const ImageGrid = ({
    data: data_IN
    , noData
    , onChange
}: ImageGridProps
) => {

    const [state, _set_state] = _use_state({} as {
        items?: ImageWithKind[]
    })

        , _handleEvent = (
            ev:
                | {
                    eventKind: "remove"
                    idx: number
                }
                | {
                    eventKind: "rename"
                    idx: number
                    name: string
                }
        ) => {
            if (!state.items?.length) {
                return
            }
            debugger
            const {
                eventKind
                , idx
            } = ev
            let {
                items
            } = state

                , item = (items = [...items])[idx] ?? {}

            switch (eventKind) {
                case "rename": {
                    const {
                        name
                    } = ev
                    item = items[idx] = { ...item, name }
                    break;
                }
                case "remove": {
                    const {
                        src
                    } = item
                    if (!src) {
                        return
                    }
                    URL.revokeObjectURL(src)
                    items.splice(idx, 1)
                    break
                }
            }

            _set_state({ items })

            onChange?.({
                data: item
                , idx
                , eventKind
            })

        }


    _effect([data_IN], () => {
        data_IN ??= []
        _set_state({
            items: data_IN ?? []
        })
    })

    return (
        <div className="flex-1 overflow-auto border border-gray-200 rounded p-3">
            {!state.items?.length
                ? (noData || <NoData />)
                : <div className="grid grid-cols-2 gap-3">
                    {state.items.map((image, idx) => (
                        <>
                            <ImageRenderer
                                data={image}
                                onRename={ev => _handleEvent({
                                    ...ev
                                    , idx
                                })}
                            >
                                <div className="flex justify-end">
                                    <Button
                                        appearance="subtle"
                                        onClick={() => _handleEvent({
                                            eventKind: "remove"
                                            , idx
                                        })}>
                                        Remove
                                    </Button>
                                </div>
                            </ImageRenderer>
                            {/* <div key={image.src}
                                className="border border-gray-200 rounded p-2 flex flex-col gap-2"
                            >
                                <div className="w-full aspect-video bg-gray-50 rounded flex items-center justify-center overflow-hidden">
                                    <img
                                        src={image.src}
                                        alt={image.name}
                                        className="max-h-full max-w-full object-contain"
                                        draggable={false}
                                    />
                                </div>

                                <Input
                                    type="text"
                                    value={image.name}
                                    onChange={v => _handleEvent({
                                        eventType: "rename"
                                        , idx
                                        , name: String(v)
                                    })}
                                    placeholder="Name"
                                />

                                <div className="flex justify-end">
                                    <Button
                                        appearance="subtle"
                                        onClick={() => _handleEvent({
                                            eventType: "remove"
                                            , idx
                                        })}>
                                        Remove
                                    </Button>
                                </div>
                            </div> */}
                        </>
                    ))}
                </div>}
        </div>
    )
}