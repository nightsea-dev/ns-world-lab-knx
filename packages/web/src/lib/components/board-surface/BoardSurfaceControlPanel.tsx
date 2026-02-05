import {

} from "react"
import { _cn } from "../../utils"
import { EventHandlersFromMap, XOR } from "@ns-lab-knx/types"
import {
    Input
} from "rsuite"
import { ButtonGroupRS, ButtonGroupRSProps, ShowInfo, ToggleRS } from "../ui"


// ======================================== events
export type BoardSurfaceControlPanelEvent =
    & {
        numberOfItems: number
        showInfo: boolean
    }

export type BoardSurfaceControlPanelEventsMap = {
    change:
    & BoardSurfaceControlPanelEvent

    , enterKey:
    & BoardSurfaceControlPanelEvent
}

// ======================================== props
export type BoardSurfaceControlPanelProps =
    & {
        numberOfItems?: number
        showInfo?: boolean
        isDisabled?: boolean
    }
    & Pick<
        ButtonGroupRSProps
        , "buttonsMap"
    >
    & Partial<
        & EventHandlersFromMap<BoardSurfaceControlPanelEventsMap>
    >


// ======================================== component
export const BoardSurfaceControlPanel = ({
    buttonsMap
    , numberOfItems
    , showInfo = true
    , isDisabled
    , onChange
    , onEnterKey
}: BoardSurfaceControlPanelProps
) => {
    numberOfItems = Math.max(1, numberOfItems || 1)
    console.log({ buttonsMap })
    return (
        <div
            className={_cn(`
                absolute bottom-2 left-2
                flex flex-row items-center gap-2
                z-20
                `
            )}
        >
            <ShowInfo
                checked={showInfo}
                name="BoardSurface"
                size="xs"
                onChange={({ value: showInfo }) => onChange?.({
                    numberOfItems
                    , showInfo
                })}
            />
            <Input
                data-number-of-items-input
                type="number"
                className="text-center"
                size="sm"
                min={1}
                max={10}
                value={numberOfItems}
                width={60}
                onChange={value => onChange?.({
                    numberOfItems: Number(value)
                    , showInfo
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
                            , showInfo
                        })
                    }
                }}
            />
            <ButtonGroupRS
                buttonsMap={buttonsMap}
                disabled={isDisabled}
            />
        </div>
    )
}
