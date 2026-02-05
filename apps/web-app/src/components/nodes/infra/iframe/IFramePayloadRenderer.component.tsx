import {
    IdeaWithAuthor,
    IFrameWithKind
} from '@ns-lab-knx/types'
import {
    _cn,
    PayloadRendererProps,
} from '@ns-lab-knx/web'

// ======================================== props
export type IFramePayloadRendererProps =
    & PayloadRendererProps<IFrameWithKind>

// ======================================== component
/**
 * [payload-renderer]
 */
export const IFramePayloadRenderer = ({
    payload
}: IFramePayloadRendererProps
) => {

    const {
        id
        , kind
        , name
        , src
    } = payload

    if (!src) {
        throw new Error(`[payload.src] is required.`)
    }


    return (
        <iframe
            data-iframe-payload
            src={src}
            name={name}
            data-kind={kind}
            className="block w-full h-full border-0 bg-amber-500"
        />
    )

}
