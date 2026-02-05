// ========================================
export const EXTENSION_TO_MIME = {
    png: "image/png",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    webp: "image/webp",
    gif: "image/gif",
    svg: "image/svg+xml",
    bmp: "image/bmp",
} as const satisfies Record<string, string>

export type ImageExtension = keyof typeof EXTENSION_TO_MIME

export type MimeType = typeof EXTENSION_TO_MIME[ImageExtension]

export type HasMimeType = {
    mimeType: MimeType | string
}
