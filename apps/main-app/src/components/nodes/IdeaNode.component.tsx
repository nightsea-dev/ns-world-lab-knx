import {
    HasPayload,
    IdeaWithAuthor
} from '@ns-lab-klx/types'
import {
    _cn,
    PayloadRendererProps,
    SurfaceNode
} from '@ns-lab-klx/web'
import {
    getRandomColour,
    getRandomColourRgbString
} from "@ns-lab-klx/logic"


export type IdeaNodeProps =
    & HasPayload<IdeaWithAuthor>

// ========================================
/**
 * [renderer]
 */
export const IdeaNodeComponent = ({
    payload
}: IdeaNodeProps
) => {

    const {
        content
        , color: backgroundColor = getRandomColour().toRgbString()
        , kind
        , title
    } = payload


    return (
        <div
            data-idea-node-component
            data-background-color={backgroundColor}
            className={_cn(
                "flex flex-col justify-center items-center h-full w-full"
                // , `bg-[${color}]`
            )}
            style={{
                backgroundColor
            }}
        >
            <div
                className="w-full text-center"
            >
                {payload.content}
            </div>
        </div>
    )

}
