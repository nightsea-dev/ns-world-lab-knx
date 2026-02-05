import { EventHandlersFromMap } from "@ns-lab-knx/types";
import { X, XIcon, LucideX } from "lucide-react";
import { MouseEvent, useId, useLayoutEffect } from "react";
import { Button, ButtonProps } from "rsuite";
import CloseIcon from '@rsuite/icons/Close';
import { _cn } from "../../utils";

// ======================================== props
export type CloseButtonProps =
    & Omit<ButtonProps, "children">
// & Partial<
//     & EventHandlersFromMap<{
//         click: MouseEvent<HTMLButtonElement>
//     }>
// >

// ======================================== component
const CONST = {
    position: 10
    , size: 10
    , inner: 20
}
export const CloseButton = ({
    onClick
    , ...rest
}: CloseButtonProps
) => {
    const id = useId()
        , _handleClick = (
            ev: MouseEvent<HTMLButtonElement>
        ) => {
            debugger
            ev.preventDefault()
            ev.stopPropagation()
            onClick?.(ev)
        }

    useLayoutEffect(() => {

        const el = document.getElementById(id) as HTMLElement | undefined

        if (!el) {
            return
        }

        const {
            width
            , height
        } = el.getBoundingClientRect()
        if (width === height) {
            return
        }
        const max = Math.max(width, height)
        el.style.minWidth
            = el.style.minHeight
            = max + "px"

        return () => {
            el.style.minWidth
                = el.style.minHeight
                = ""
        }



    })
    return (
        <Button
            {...rest}
            id={id}
            data-close-button
            appearance="subtle"
            size="xs"
            className={_cn(
                `
                cursor-default
                w-[10px] h-[10px] justify-center items-center 
                p-[20px]
                ---absolute
                ---top-1
                ---right-1
                `
                , rest.className
            )}

            aria-label="Close"
            onClick={_handleClick}
        >
            <CloseIcon />
        </Button>
    )
    // return (
    //     <button
    //         {...rest}
    //         type="button"
    //         aria-label="Close"
    //         onClick={_handleClick}
    //         className={`
    //             absolute 
    //             inline-flex

    //             top-2
    //             right-2

    //             h-4
    //             w-4

    //             items-center justify-center
    //             rounded-lg
    //             text-neutral-600 hover:text-neutral-900
    //             hover:bg-neutral-100
    //             focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-offset-2
    //             overflow-hidden
    //             z-100
    //         `}
    //     >
    //         <span
    //             className={`
    //                 relative block 
    //                 h-4
    //                 w-4
    //             `}>
    //             <span className={`
    //             absolute inset-0 m-auto h-0.5 
    //             w-2 
    //             bg-current rotate-45
    //                 `} />
    //             <span className={`
    //             absolute inset-0 m-auto h-0.5 
    //             w-2 
    //             bg-current -rotate-45
    //                 `} />
    //         </span>
    //     </button>
    // )


}
