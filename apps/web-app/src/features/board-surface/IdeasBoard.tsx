import {
    _effect
    , BoardSurfaceProps
    , BoardSurface
} from '@ns-lab-knx/web'
import {
    createIdeaWithAuthor
} from "@ns-lab-knx/logic"
import {
    IdeaNodeComponent
} from '../../components'
import {
    IdeaWithAuthor
} from '@ns-lab-knx/types'

// ======================================== CONST
const APP_NAME = "@ns-lab-knx/web"
// ======================================== props
export type IdeasBoardProps =
    & Partial<
        & Pick<
            BoardSurfaceProps<IdeaWithAuthor>,
            | "data"
            | "createPayloadFn"
            | "onNodesAdded"
            | "onNodesRemoved"
            | "children"
        // | "payloadRenderer"
        >
    >
// ======================================== component
export const IdeasBoard = ({
    data
    , createPayloadFn = createIdeaWithAuthor
    , children = IdeaNodeComponent
    , ...rest
}: IdeasBoardProps
) => {

    _effect([], () => {
        document.title = APP_NAME
    })

    return (
        <BoardSurface
            {...rest}
            data={data}
            createPayloadFn={createPayloadFn}
            children={children}
            kind="idea"
        // createPayloadFn={createDataItemFn}
        // kind="idea"
        // data={data}
        // payloadRenderer={() => {
        //     return (
        //         <IdeaNodeComponent
        //         />
        //     )
        // }}
        />
    )

}

