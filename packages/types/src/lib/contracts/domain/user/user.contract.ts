import { HasUuid } from "../../primitives"

export type User =
    & HasUuid
    & {
        // uuid: string
        name: string
        email: string
        job: string
    }
