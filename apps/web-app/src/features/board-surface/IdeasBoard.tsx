import {
    _effect
    , BoardSurfaceProps
    , BoardSurfaceComponent,
    HasCreatePayloadFn,
    _memo,
    _use_state
} from '@ns-lab-knx/web'
import {
    createIdeaWithAuthor
} from "@ns-lab-knx/logic"
import {
    IdeaWithAuthor
} from '@ns-lab-knx/types'
import { IdeaPayloadRenderer } from '../../components'

// ======================================== CONST
// ======================================== props
export type IdeasBoardProps =
    & Partial<
        & Pick<
            BoardSurfaceProps<IdeaWithAuthor>,
            | "data"
            | "onNodesAdded"
            | "onNodesRemoved"
        >
    >
// ======================================== component
export const IdeasBoard = ({
    data: data_IN
    // , createPayloadFn = () => createIdeaWithAuthor()
    // , children = IdeaPayloadRenderer
    , ...rest
}: IdeasBoardProps
) => {

    const [state, _set_state] = _use_state({
        data: [] as IdeaWithAuthor[]
        , isFirstRender: true
    })

    _effect([data_IN], () => {
        if (!data_IN || data_IN === state.data) {
            return
        }
        _set_state({
            data: data_IN
        })
    })

    _effect([], () => {

        if (!state.isFirstRender || state.data.length) {
            return
        }

        _set_state({
            data: [createIdeaWithAuthor()]
            , isFirstRender: false
        })
    })

    return (
        <BoardSurfaceComponent
            {...rest}
            data={state.data}
            // children={children}
            createPayloadFnMap={{
                "Add Idea": createIdeaWithAuthor
            }}

        >
            {IdeaPayloadRenderer}
            {/* {({ payload }) => {
                return <IdeaPayloadRenderer
                    payload={payload}
                />
            }} */}
        </BoardSurfaceComponent>
    )

}

