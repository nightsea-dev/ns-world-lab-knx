import { useLayoutEffect, useRef, useState } from "react"

export const useElementHeight = <
    T extends HTMLElement = HTMLDivElement
>() => {
    const ref = useRef<T | null>(null)
        , [height, _set_height] = useState({} as DOMRect["height"])

    useLayoutEffect(() => {
        if (!ref.current) {
            return
        }
        const el = ref.current

            , ro = new ResizeObserver(() => {
                _set_height(el.getBoundingClientRect().height)
            })

        ro.observe(el)
        _set_height(el.getBoundingClientRect().height)

        return () => ro.disconnect()
    }, [])

    return { ref, height }

}
