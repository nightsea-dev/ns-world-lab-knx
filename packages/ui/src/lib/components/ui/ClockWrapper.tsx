import { useState, useEffect } from 'react'

const ClockDisplay = () => {
    const [time, setTime] = useState(new Date())

    useEffect(() => {
        setInterval(() => {
            setTime(new Date())
        }, 1000)
    }, [])

    const pad = (n: number) => n.toString().padStart(2, '0')

    return (
        <div>
            {pad(time.getHours())}:{pad(time.getMinutes())}:{pad(time.getSeconds())}
        </div>
    )
}

export const ClockWrapper = () => {
    const [showClock, setShowClock] = useState(false)

    return (
        <div className="flex items-center">
            <button
                className="px-4 py-2 rounded cursor-pointe m-2"
                style={{
                    backgroundColor: '#00b7f3',
                    color: 'white',
                }}
                onClick={() => setShowClock(s => !s)}
            >
                {showClock ? 'Hide Clock' : 'Show Clock'}
            </button>
            {showClock && <ClockDisplay />}
        </div>
    )
}
