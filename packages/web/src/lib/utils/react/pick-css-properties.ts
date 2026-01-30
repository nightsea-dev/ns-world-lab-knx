import { CSSProperties, HTMLAttributes } from "react";


export type PickCssProperties<
    K extends keyof CSSProperties
>
    = Pick<CSSProperties, K>

