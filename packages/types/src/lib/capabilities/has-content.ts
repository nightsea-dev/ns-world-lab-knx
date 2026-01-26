
/**
 * * this one seems to be the [renderedContent]
 */
export type HasContent<
    C extends any = string
> = {
    content: C
}