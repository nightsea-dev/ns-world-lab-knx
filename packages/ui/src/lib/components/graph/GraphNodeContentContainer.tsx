import { HasContent } from "@ns-lab-klx/types"
import { FunctionComponent, ReactNode } from "react"


// ======================================== component
export type GraphNodeContentContainerProps =
    & HasContent<ReactNode>

export type GraphNodeContentContainer = FunctionComponent<GraphNodeContentContainerProps>

export const GraphNodeContentContainer: GraphNodeContentContainer = ({
    content
}) => {
    return (
        <div
            data-graph-node-content-container
            className="flex flex-col justify-center items-center h-full w-full"
        >
            <div className="w-full text-center">
                {/* {node.payload} */}
                data-graph-node-content-container
                {content}
            </div>
        </div>
    )
}



export type HasGraphNodeContentContainer
    = {
        /**
         * [renderer]
         */
        contentContainer: GraphNodeContentContainer
    }