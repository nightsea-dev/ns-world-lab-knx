import { HasKind, HasPayload, KindBase } from "../../../capabilities"
import { HasId } from "../../../primitives"


export type PayloadWithKind<
    K extends KindBase
> =
    & object
    & HasId
    & HasKind<K>


// ========================================
export type HasPayloadWithKind<
    P extends PayloadWithKind<any>
> = HasPayload<P>

export type HasPayloadWithKindCollection<
    P extends PayloadWithKind<any>
> = {
    payloads: P[]
}