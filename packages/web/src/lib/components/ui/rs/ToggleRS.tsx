import { ReactNode } from "react"
import { Toggle, ToggleProps } from "rsuite"
import { _cn } from "../../../utils"
import { EventHandlersFromMap } from "@ns-lab-klx/types"

// ======================================== events
export type ToggleRSEventsMap = {
    change: {
        value: boolean
    }
}
// ======================================== props
export type ToggleRSProps =
    & Omit<ToggleProps, "label" | "onChange">
    & {
        label?: ReactNode
    }
    & EventHandlersFromMap<ToggleRSEventsMap>

// ======================================== component
export const ToggleRS = (
    {
        size = "xs"
        , label
        , children = label
        , checked
        , className
        , onChange
        , ...rest
    }: ToggleRSProps
) => {

    return (
        <div
            className={_cn(
                `
                flex items-center gap-1 whitespace-nowrap text-[12px]
                border-[1px]
                border-gray-200
                rounded-[8px]
                py-[6px]
                px-[10px]
                bg-white
                `
                , className
            )}
        >
            <Toggle
                {...rest}
                checked={checked}
                size={size}
                onChange={value => onChange?.({
                    value
                })}
            >
                <div
                    className="text-[12px]"
                >
                    {children}
                </div>
            </Toggle>
        </div>
    )
}