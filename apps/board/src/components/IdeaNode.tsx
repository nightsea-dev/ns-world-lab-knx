import {
    HasData
    , IdeaWithAuthor,
    PickRequiredRestPartial
} from '@ns-lab-klx/types'
import {
    GraphNodeComponent
    , GraphNodeComponentProps
} from '@ns-lab-klx/ui'


// ========================================
export type IdeaNodeData =
    & HasData<IdeaWithAuthor>
    & Pick<
        GraphNodeComponentProps,
        | "size"
        | "position"
    >
export type IdeaNodeProps =
    & PickRequiredRestPartial<
        & IdeaNodeData
        & Pick<
            GraphNodeComponentProps,
            | "onCloseButtonClick"
            | "onChange"
        >
        , "data"
    >

// ========================================
export const IdeaNode = ({
    data: idea
    , size
    , position
    , onCloseButtonClick
    , onChange
}: IdeaNodeProps
) => {

    const {
        content
        , color
        , kind
        , title
    } = idea

    return (
        <GraphNodeComponent
            // content={content}
            {...{
                backgroundColor: color
                , size
                , position
                , onCloseButtonClick
                , onChange
            }}
        >
            <div className="flex flex-col justify-center items-center h-full w-full">
                <div className="w-full text-center">
                    {idea.content}
                </div>
            </div>
        </GraphNodeComponent>
    )
    // useOnPositionChange(idea)

    // return (
    //     <Rnd
    //         size={{ width: idea.size.width, height: idea.size.height }}
    //         position={{ x: idea.position.x, y: idea.position.y }}
    //         onDragStop={(_, d) => {
    //             idea.updatePosition(d.x, d.y)
    //         }}
    //         onResizeStop={(e, dir, elementRef, delta, newPosition) => {
    //             idea.updateSize(idea.size.width + delta.width, idea.size.height + delta.height)
    //             idea.updatePosition(newPosition.x, newPosition.y)
    //         }}
    //         bounds="parent"
    //         className="border border-gray-300 p-2"
    //         style={{ background: idea.color }}
    //     >
    //         <div className="flex flex-col justify-center items-center h-full w-full">
    //             <div className="w-full text-center">{idea.content}</div>
    //         </div>
    //     </Rnd>
    // )
}
