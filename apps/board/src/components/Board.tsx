import { IdeaNode, IdeaNodeData, IdeaNodeProps } from './IdeaNode'
import { createIdeaWithAuthor, createPosition, createSize } from "@ns-lab-klx/logic"
import { IdeaWithAuthor, Position, Position_KEYS, Transformation } from '@ns-lab-klx/types'
import { _effect, _use_state } from "@ns-lab-klx/ui"
import { useId } from 'react'



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
}

const createIdeaNodeData = ({
    data = createIdeaWithAuthor()
    , size
    , position
} = {} as Partial<IdeaNodeData>
): IdeaNodeData => {
    return {
        data
        , size: createSize(size)
        , position: createPosition(position)
    }
}


// ======================================== component
export const Board = () => {

    const id = useId()

        , [state, _set_state] = _use_state({
            ideas: [] as IdeaNodeData[]
        })

        , _addIdea = () => {

            const {
                ideas
            } = state

                , _nextPosition = (): Position => {
                    const {
                        width: c_width
                        , height: c_height
                    } = document.getElementById(id)!.getBoundingClientRect()

                        , {
                            transform: {
                                size: {
                                    width: t_width
                                    , height: t_height
                                }
                            }
                        } = DEFAULT

                    return {
                        x: (c_width - t_width) / 2
                        , y: (c_height - t_height) / 2
                    } as Position

                }

                , {
                    transform: {
                        position: d_position
                        , size: d_size
                    }
                } = DEFAULT

                , newIdea = createIdeaNodeData({
                    position: _nextPosition()
                    , size: d_size
                })

            ideas.push(newIdea)

            _set_state({
                ideas: [...ideas]
            })

        }

        , _handleAddIdeaButtonClick = () => {
            _addIdea()
        }

        , _handleCloseButtonClick = (
            idea: IdeaWithAuthor
        ) => {

            const {
                ideas
            } = state

                , i = ideas.findIndex(nodeData => nodeData.data.id === idea.id)

            if (i >= 0) {
                ideas.splice(i, 1)
                _set_state({
                    ideas: [...ideas]
                })
            }

        }

    _effect([], () => {
        if (state.ideas.length) {
            return
        }
        _addIdea()
    })

    return (
        <div
            id={id}
            className="h-full flex flex-col relative"
        >
            <div
                className="flex-1 relative"
                style={{
                    position: 'relative',
                    width: '100%',
                }}
            >
                {state.ideas.map((o, i) => {
                    const {
                        data: idea
                        , position
                        , size
                    } = o
                    return (
                        <IdeaNode
                            key={[idea.id, i].join("|")}
                            data={idea}
                            size={size}
                            position={position}
                            onCloseButtonClick={() => _handleCloseButtonClick(idea)}
                            onChange={({ node }) => {
                                o.position = node.position
                                o.size = node.size
                            }}
                        />
                    )
                })}
            </div>
            <button
                className="left-2 bottom-2 px-4 py-2 rounded absolute cursor-pointer"
                style={{
                    backgroundColor: '#00b7f3',
                    color: 'white',
                }}
                onClick={_handleAddIdeaButtonClick}
            // onClick={() =>
            //     setIdeas(prev => [
            //         ...prev,
            //         createIdeaNodeData({ position: { x: 100 + prev.length * 20, y: 120 } }),
            //     ])
            // }
            >
                Add idea
            </button>
        </div>
    )
}
