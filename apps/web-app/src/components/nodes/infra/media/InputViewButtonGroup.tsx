import { Button } from "rsuite"
import { _effect, _memo, _use_state, ObjectView, ShowInfo, ShowInfoProps } from "@ns-lab-knx/web"
import { EventHandlersFromMap, EventHandlersWithKindFromMap, KeyOf } from "@ns-lab-knx/types"


export type InputViewButtonGroupEventsMap = {
    cancel: {}
    clear: {}
    done: {}
    showInfoChange: {
        showInfo: boolean
    }
}
export type InputViewButtonGroupEventKind =
    KeyOf<InputViewButtonGroupEventsMap>

const INPUT_VIEW_BUTTON_GROUP_EVENT_KINDS = [
    "cancel"
    , "clear"
    , "done"
    , "showInfoChange"
] as InputViewButtonGroupEventKind[]


type IsDisabledFn = (k?: InputViewButtonGroupEventKind) => boolean
type isDisabledMap = Partial<{
    [k in InputViewButtonGroupEventKind]: boolean | IsDisabledFn
}>

export type InputViewButtonGroupProps =
    & Partial<
        & {
            showInfo: boolean
            showInfoName: string
            isDisabled: isDisabledMap | boolean
        }
        & EventHandlersFromMap<InputViewButtonGroupEventsMap>
    >

const EMPTY_isDisabledFn: IsDisabledFn = () => false

export const InputViewButtonGroup =
    ({
        showInfo
        , showInfoName
        , onCancel
        , onShowInfoChange
        , onClear
        , onDone
        , isDisabled: isDisabledFnMap_IN
    } = {} as InputViewButtonGroupProps
    ) => {

        const {
            isDisabledFn
        } = _memo([isDisabledFnMap_IN], () => {
            if (typeof (isDisabledFnMap_IN) === "boolean") {
                return {
                    isDisabledFn: () => isDisabledFnMap_IN
                }
            }
            const isDisabledFnMap = Object.fromEntries(
                INPUT_VIEW_BUTTON_GROUP_EVENT_KINDS
                    .map(k => {
                        const v = isDisabledFnMap_IN?.[k] ?? EMPTY_isDisabledFn
                            , fn = typeof (v) === "function"
                                ? v
                                : () => v

                        return [k, fn]
                    })
            ) as Record<InputViewButtonGroupEventKind, IsDisabledFn>

            return {
                isDisabledFn: (k: InputViewButtonGroupEventKind) => isDisabledFnMap[k](k)
            }

        })


        return (
            <div className="flex justify-end gap-2">
                {onShowInfoChange && <ShowInfo
                    checked={showInfo}
                    name={showInfoName}
                    size="xs"
                    onChange={({ value: showInfo }) => onShowInfoChange({ showInfo })}
                />}
                {onCancel && <Button
                    appearance="subtle"
                    onClick={onCancel}
                    disabled={isDisabledFn("cancel")}
                >
                    Cancel
                </Button>}
                {onClear && <Button
                    appearance="subtle"
                    onClick={onClear}
                    disabled={isDisabledFn("clear")}
                >
                    Clear
                </Button>}
                {onDone && <Button
                    appearance="primary"
                    disabled={isDisabledFn("done")}
                    onClick={onDone}
                >
                    OK
                </Button>}
            </div>
        )

    }