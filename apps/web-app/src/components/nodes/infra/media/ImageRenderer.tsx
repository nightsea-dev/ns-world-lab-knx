import { HasData, HasPartialData, EventHandlersFromMap, EventHandlersWithKindFromMap, HasName, HasSource } from "@ns-lab-knx/types"
import { _effect, _use_state, NoData, PickHtmlAttributes } from "@ns-lab-knx/web"
import { Button, Input } from "rsuite"


type ImageInfo =
    & HasSource
    & HasName

export type ImageRendererEvent =
    & HasData<ImageInfo>
    & HasName

export type ImageRendererEventsMap = {
    rename: ImageRendererEvent
}

export const ImageRenderer = (
    {
        data
        , children
        , onRename
        , isReadonly = !onRename
    }:
        & Partial<
            & HasData<ImageInfo>
            & EventHandlersWithKindFromMap<ImageRendererEventsMap>
            & PickHtmlAttributes<"children">
            & {
                isReadonly: boolean
            }
        >
) => {

    const _handleEvent = ({
        name
    }: Pick<ImageRendererEvent, "name">
    ) => {
        if (!data) {
            return
        }
        data = { ...data, name }
        onRename?.({
            name
            , data
            , eventKind: "rename"
        })
    }

    return (
        !data ? <NoData />
            : <div key={data.src}
                className={`
                    border border-gray-200 rounded 
                    p-2 
                    flex flex-col gap-2
                    max-w-[400px]
                    overflow-hidden
                    `}
            >
                <div className={`
                    w-full
                    aspect-video 
                    bg-gray-50 rounded 
                    flex items-center 
                    justify-center 
                    overflow-hidden
                    `}>
                    <img
                        src={data.src}
                        alt={data.name}
                        className={`
                            ---max-h-[200px] 
                            ---max-w-[250px] 
                            object-contain
                            `}
                        draggable={false}
                    />
                </div>

                {isReadonly
                    ? <div
                        className="border-1 border-gray-200 rounded-[5px] px-1 py-0.5 text-center"
                    >
                        {data.name}
                    </div>
                    : <Input
                        type="text"
                        value={data.name}
                        onChange={v => _handleEvent({
                            name: String(v)
                        })}
                        placeholder="Name"
                    />
                }

                {children}

            </div>
    )
}


{/* <div className="flex justify-end">
<Button
    appearance="subtle"
    onClick={() => _handleEvent({
        eventType: "remove"
        , idx
    })}>
    Remove
</Button>
</div> */}