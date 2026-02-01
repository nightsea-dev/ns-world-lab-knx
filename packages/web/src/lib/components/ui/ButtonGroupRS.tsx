import { ButtonGroup, ButtonProps, ButtonGroupProps, Button } from "rsuite"
import { entriesOf } from "@ns-lab-knx/logic"

export type ButtonsMap =
    & {
        [k: string]: ButtonProps["onClick"] | ButtonProps
    }

export type ButtonGroupRSProps =
    & ButtonGroupProps
    & {
        buttonsMap: ButtonsMap
    }


export const ButtonGroupRS = ({
    buttonsMap
    , ...rest
}: ButtonGroupRSProps
) => {
    return (
        <ButtonGroup
            {...rest}
            data-button-group-rs
        >
            {entriesOf(buttonsMap).map(([k, v], i) => {

                const p = (typeof (v) === "function"
                    ? {
                        onClick: v
                    }
                    : v
                ) as ButtonProps

                return (
                    <Button
                        key={k}
                        children={k}
                        {...p}
                    />
                )

            })}
        </ButtonGroup>
    )
}