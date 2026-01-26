export type KindBase = Lowercase<string>

export type HasKind<
    K extends KindBase
> = {
    readonly kind: K    //`${K}`
}