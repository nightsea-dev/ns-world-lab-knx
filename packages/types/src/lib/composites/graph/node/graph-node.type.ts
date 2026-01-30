import { HasPayload } from "../../../capabilities";
import {
    HasTransformation
    , HasTransformationMutators
} from "../../../contracts";
import { HasId } from "../../../primitives";
import { PayloadWithKind } from "../payload";



// ---------------------------------------- contracts
export type GraphNode =
    & HasTransformation

// export type GraphNodeWithColor =
//     & GraphNode
//     & HasColor


// ---------------------------------------- composites
/**
 * * any [payload]
 */
export type GraphNodeWithAnyPayload<
    P extends any = unknown //PayloadWithKind<any>
> =
    & HasId
    & GraphNode
    & HasPayload<P>

export type GraphNodeWithKindedPayload<
    P extends PayloadWithKind<any>
> = GraphNodeWithAnyPayload<P>


// ---------------------------------------- composites w/behaviour
export type GraphNodeWithTransformMutators
    =
    & GraphNode
    & HasTransformationMutators



// ---------------------------------------- composites w/behaviour
export type GraphNodeWithAnyPayloadAndTransformationMutators<
    P extends any = unknown
> =
    & GraphNodeWithAnyPayload<P>
    & HasTransformationMutators



export type GraphNodeWithKindedPayloadAndTransformationMutators<
    P extends PayloadWithKind<any>
> = GraphNodeWithAnyPayloadAndTransformationMutators<P>


