import { CSSProperties, HTMLAttributes } from "react";


export type PickCssProperties
    <
        K extends keyof CSSProperties
    >
    = Pick<CSSProperties, K>


export type PickHtmlAttributes
    <
        K extends keyof HTMLAttributes<HTMLElement>
    >
    = Pick<HTMLAttributes<HTMLElement>, K>
