import { ButtonHTMLAttributes, DetailedHTMLProps, ReactNode } from "react"
import { _cn } from "../../utils"
import { EventHandlersFromMap, XOR } from "@ns-lab-klx/types"
import { entriesOf } from "@ns-lab-klx/logic"
import { Input, InputProps } from "rsuite"

type SurfaceButtonProps = DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
>

export const SurfaceButton = (
    props: SurfaceButtonProps
) => {
    return (
        <button
            {...props}
            className={_cn(
                "px-4 py-2 rounded cursor-pointer bg-[#3498ff] !text-white",
                props.className
            )}
        >
            {props.children}
        </button>
    )
}

// ======================================== events
export type SurfaceButtonGroupEventsMap = {
    change: {
        numberOfItems: number
    }
    , enterKey: {
        numberOfItems: number
    }
}

// ======================================== props
export type SurfaceButtonGroupProps =
    & {
        buttonsMap: {
            [k: string]: SurfaceButtonProps["onClick"] | SurfaceButtonProps
        }
        numberOfItems?: number
    }
    & Partial<
        & EventHandlersFromMap<SurfaceButtonGroupEventsMap>
    >

// ======================================== component
export const SurfaceButtonGroup = ({
    buttonsMap
    , numberOfItems
    , onChange
    , onEnterKey
}: SurfaceButtonGroupProps
) => {
    numberOfItems = Math.max(1, numberOfItems || 1)
    return (
        <div
            className={_cn(`
                absolute bottom-2 left-2
                flex flex-row items-center gap-2
                z-20
                `
            )}
        >
            <Input
                type="number"
                className="text-center"
                min={1}
                max={10}
                value={numberOfItems}
                width={50}
                onChange={value => onChange?.({
                    numberOfItems: Number(value)
                })}
                onKeyDown={ev => {
                    if (
                        onEnterKey
                        &&
                        ev.key === "Enter"
                    ) {

                        debugger
                        onEnterKey({
                            numberOfItems: Number(ev.currentTarget.value)
                        })
                    }
                }}
            />
            {entriesOf(buttonsMap).map(([k, v], i) => {

                const p = (typeof (v) === "function"
                    ? {
                        onClick: v
                    }
                    : v
                ) as SurfaceButtonProps

                return (
                    <SurfaceButton
                        children={k}
                        {...p}
                        key={[k, i].join("|")}
                    />
                )

            })}
        </div>
    )
}
