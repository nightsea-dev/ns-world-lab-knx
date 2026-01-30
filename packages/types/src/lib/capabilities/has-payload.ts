import { SuffixedKey, SuffixedString } from "../ts";

export type HasPayload<
    P extends any = unknown
> = {
    payload: P
}