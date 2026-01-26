import {
    HasColor, HasContent, HasKind, HasTitle

} from "../../../capabilities/index.js"
import { HasId } from "../../primitives/id.js"

// ---------------------------------------- contracts
export type Idea =
    & HasId
    & HasTitle
    & HasColor
    & HasContent
// & {
//     // type: 'idea'
//     title: string
//     color: string

//     /**
//      * * this one seems to be the [renderedContent]
//      */
//     content?: string
// }

/**
 * * can be a [NodePayload]
 */
export type IdeaWithKind =
    & Idea
    & HasKind<"idea">





// SPATIAL BEHAVIOURS belong to the ==> [GraphNode]
// export type IdeaWithMutators
//     =
//     & IdeaBase
//     & {
//         updatePosition(x: number, y: number): void
//         updateSize(width: number, height: number): void
//     }

// export type IdeaWithAuthorAndMutators
//     =
//     & IdeaWithAuthor
//     & IdeaWithMutators


// export type IdeaPayload
//     = PayloadBase<
//         "idea"
//         , IdeaWithMutators
//     >

// ---------------------------------------- capabilitites
export type HasIdea<
    I extends Idea
> = {
    idea: I
}

