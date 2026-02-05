

export const _isValidUrl = (
    value?: string
): boolean => {
    if (!value) return false
    try {
        const url = new URL(value)
        return url.protocol === "http:" || url.protocol === "https:"
    } catch {
        return false
    }
}