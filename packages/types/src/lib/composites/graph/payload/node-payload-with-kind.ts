import { HasKind, HasPayload, KindBase } from "../../../capabilities"
import { HasId } from "../../../contracts"


// ========================================
// export type PayloadType = "any" | "kinded"
// ========================================
export type PayloadWithKind<
    K extends KindBase
> =
    & HasId
    & HasKind<K>


// ========================================
export type HasPayloadWithKind<
    P extends PayloadWithKind<any>
> = HasPayload<P>