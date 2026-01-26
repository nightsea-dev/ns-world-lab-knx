import { IdeaWithKind } from "../../../contracts/index.js"
import { HasAuthor } from "../capabilities/has-author.js"

// ---------------------------------------- contracts
export type IdeaWithAuthor =
    & IdeaWithKind
    & HasAuthor
