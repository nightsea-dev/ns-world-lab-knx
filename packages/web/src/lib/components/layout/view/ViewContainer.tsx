import { PickHtmlAttributes } from "../../../utils"

export const ViewContainer = (
    {
        isVisible
        , ...rest
    }:
        & PickHtmlAttributes<"children" | "className">
        & {
            isVisible?: boolean
        }
) => {
    return (
        <div
            {...rest}
            className={`
                ${rest.className ?? ""}
                ${isVisible ? "block" : "hidden"}
                flex-1 min-h-0 h-full
                `}
        />
    )

}
