export type KindBase = Lowercase<string>

export type HasKind<
    K extends KindBase = KindBase
> = {
    readonly kind: K    //`${K}`
}