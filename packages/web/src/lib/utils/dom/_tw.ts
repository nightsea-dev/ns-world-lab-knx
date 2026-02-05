export const _tw = (
    strings: TemplateStringsArray,
    ...expr: Array<string | undefined | null | false>
): string =>
    strings
        .map((s, i) => `${s}${expr[i] ?? ""}`)
        .join("")
        .trim()
