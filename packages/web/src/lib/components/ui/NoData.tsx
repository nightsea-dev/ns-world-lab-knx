import { _cn, PickHtmlAttributes } from "../../utils";


export const NoData = (
    props: PickHtmlAttributes<"className">
) => <div
    {...props}
    className={_cn(
        `
    text-xs text-slate-500 
    border-[1px]
    border-gray-200
    text-center
    p-4
`
        , props.className
    )}
>[ NO DATA ]</div>