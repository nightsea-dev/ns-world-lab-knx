



export const timestamp = (
    d = new Date()
) => d.toISOString().split(/[tz\:]/img).slice(1, 4).join("")

    , _t = (
        d = new Date()
    ) => `[${timestamp(d)}]`