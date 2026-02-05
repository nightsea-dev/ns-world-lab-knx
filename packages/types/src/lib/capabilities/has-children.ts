
export type HasChildren<
    C extends unknown = string
> = {
    children: C
}

export type HasPartialChildren<
    C extends unknown = string
> = Partial<HasChildren<C>>