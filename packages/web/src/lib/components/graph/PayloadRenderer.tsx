import { FunctionComponent, ReactNode } from "react"
import {
    HasPayloadWithKind
    , KindBase
    , PayloadWithKind
} from "@ns-lab-klx/types"
import {
    ObjectView
} from "../ui"

// ======================================== types

export type CreatePayloadFn<
    // K extends KindBase
    P extends PayloadWithKind<any>
> = () => P//ayloadWithKind<K>//P["kind"]>

export type HasCreatePayloadFn<
    // K extends KindBase
    P extends PayloadWithKind<any>
> = {
    createPayloadFn: CreatePayloadFn<P>
}

// ======================================== PayloadRenderer
export type PayloadRendererProps<
    P extends PayloadWithKind<any>
> =
    & HasPayloadWithKind<P>

export type PayloadRenderer<
    P extends PayloadWithKind<any>
> = FunctionComponent<
    PayloadRendererProps<P>
>

export type HasPayloadRenderer<
    P extends PayloadWithKind<any>
> = {
    payloadRenderer?: PayloadRenderer<P>
}

// ======================================== default/component
export const DEFAULT_PayloadRenderer
    = <
        P extends PayloadWithKind<any>
    >({
        payload
    }: PayloadRendererProps<P>
    ) => (
        <ObjectView
            data={payload}
        />)


