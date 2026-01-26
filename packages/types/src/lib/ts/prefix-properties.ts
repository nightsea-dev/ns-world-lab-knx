import { KeyOf } from "./key-of.types";



export type PrefixProperties<
    T extends object
    , Px extends string
> = {
        [k in KeyOf<T> as `${Px}${k}`]: T[k]
    }

export type PrefixPropertiesAndCapitalise<
    T extends object
    , Px extends string
> = {
        [k in KeyOf<T> as `${Px}${Capitalize<k>}`]: T[k]
    }