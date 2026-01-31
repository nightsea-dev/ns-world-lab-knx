



export const timestamp = (
    d = new Date()
) => d.toISOString().split(/[tz]/img)[1]

    , _t = (
        d = new Date()
    ) => `[${timestamp(d)}]`