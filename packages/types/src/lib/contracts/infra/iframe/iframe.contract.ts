import { HasKind, HasName, HasSource } from "../../../capabilities"
import { HasId } from "../../../primitives"




// ========================================
export type IFrame =
    & HasId
    & HasSource
    & HasName


export type IFrameWithKind =
    & IFrame
    & HasKind<"iframe">



