import { ReactNode } from "react"
import { Toggle, ToggleProps } from "rsuite"
import { _cn } from "../../../utils"
import { EventHandlersFromMap, HasName, HasPartialName } from "@ns-lab-knx/types"

// ======================================== events
export type ToggleRSEventsMap = {
    change: {
        value: boolean
    }
}
// ======================================== props
export type ToggleRSProps =
    & Omit<ToggleProps, "label" | "onChange">
    & Partial<
        & {
            label: ReactNode
            inline: boolean
        }
        & EventHandlersFromMap<ToggleRSEventsMap>
    >

// ======================================== component
export const ToggleRS = (
    {
        size = "xs"
        , label
        , children = label
        , checked
        , inline
        , className
        , onChange
        , ...rest
    }: ToggleRSProps
) => {

    return (
        <div
            data-toggle-rs
            className={_cn(
                `
                flex items-center 
                gap-1 
                whitespace-nowrap 
                text-[12px]
                border-[1px]
                border-gray-200
                rounded-[8px]
                py-[6px]
                px-[10px]
                bg-white
                ${inline ? "inline" : ""}
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
                    className="text-[12px] pt-1"
                >
                    {children}
                </div>
            </Toggle>
        </div>
    )
}


// ======================================== ShowInfo
export type ShowInfoProps =
    & ToggleRSProps
    & HasPartialName

export const ShowInfo = (
    {
        name = ""
        , inline = true
        , ...rest
    }: ShowInfoProps
) => (
    <ToggleRS
        {...rest}
        data-show-info
        inline={inline}
    >
        Show {name} Info
    </ToggleRS>
)