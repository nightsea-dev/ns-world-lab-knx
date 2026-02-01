import { EventHandlersFromMap } from "@ns-lab-knx/types";
import { X, XIcon, LucideX } from "lucide-react";
import { MouseEvent } from "react";

// ======================================== props
export type CloseButtonProps =
    & Partial<
        & EventHandlersFromMap<{
            click: MouseEvent<HTMLButtonElement>
        }>
    >

// ======================================== component
const CONST = {
    position: 10
    , size: 10
    , inner: 20
}
export const CloseButton = ({
    onClick
}: CloseButtonProps
) => {
    return (
        <button
            type="button"
            aria-label="Close"
            onClick={onClick}
            className={`
                absolute 
                inline-flex

                top-2
                right-2

                h-4
                w-4

                items-center justify-center
                rounded-lg
                text-neutral-600 hover:text-neutral-900
                hover:bg-neutral-100
                focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-offset-2
                overflow-hidden
            `}
        >
            <span
                className={`
                    relative block 
                    h-4
                    w-4
                `}>
                <span className={`
                absolute inset-0 m-auto h-0.5 
                w-2 
                bg-current rotate-45
                    `} />
                <span className={`
                absolute inset-0 m-auto h-0.5 
                w-2 
                bg-current -rotate-45
                    `} />
            </span>
        </button>
    )


}
