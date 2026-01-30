

// ========================================

import type { CapitaliseKeys } from "./capitalise-keys.types"
import type { KeyOf } from "./key-of.types"

// transformations
export type PrefixedString<
    Px extends string
    , T extends string = string
> = `${Px}${T}`

export type SuffixedString<
    Sx extends string
    , T extends string = string
> = `${T}${Sx}`

export type PrefixedAndSuffixed<
    Px extends string
    , Sx extends string
    , T extends string = string
> =
    & PrefixedString<Px, SuffixedString<Sx, T>>



// ========================================
// compose+transform - prefix
export type PrefixKeys<
    Px extends string
    , T extends object = object
> = {
        [k in KeyOf<T> as PrefixedString<Px, k>]: T[k]
    }





export type PickPrefixedKeys<
    Px extends string
    , T extends object
    , PK extends KeyOf<T>
> = PrefixKeys<Px, Pick<T, PK>>

export type PrefixKeysAndCapitalisedAfter<
    Px extends string
    , T extends object = object
> = PrefixKeys<Px, CapitaliseKeys<T>>

// export type PrefixKeysAndCapitalise<
//     T extends object
//     , Px extends string
// > = {
//         [k in KeyOf<T> as `${Px}${Capitalize<k>}`]: T[k]
//     }    

/**
 * * PrefixKeysAndCapitalisedAfter
 */
export type PAC<
    Px extends string
    , T extends object = object
> = PrefixKeysAndCapitalisedAfter<Px, T>






export type SuffixKeys<
    Sx extends string
    , T extends object = object
> = {
        [k in KeyOf<T> as SuffixedString<Sx, k>]: T[k]
    }



// ========================================
// compose+transform - suffix
export type SuffixedKey<
    Sx extends string
    , T extends object
> = {
        [k in KeyOf<T> as SuffixedString<Sx, k>]: T[k]
    }

export type PickSuffixedKeys<
    Sx extends string
    , T extends object
    , PK extends KeyOf<T>
> = SuffixedKey<Sx, Pick<T, PK>>





// ========================================
export type ExtractPrefixedKeysLike<
    Px extends string
    , T extends object
> = Extract<KeyOf<T>, PrefixedString<Px>>

export type ExtractSuffixedKeysLike<
    Sx extends string
    , T extends object
> = Extract<KeyOf<T>, SuffixedString<Sx>>


export type PickPrefixedKeysLike<
    Px extends string
    , T extends object = object
> = {
        [k in ExtractPrefixedKeysLike<Px, T>]: T[k]
    }

export type PickSuffixedKeysLike<
    Sx extends string
    , T extends object = object
> = {
        [k in ExtractSuffixedKeysLike<Sx, T>]: T[k]
    }






export type PickAndPrefixKeys<
    Px extends string
    , T extends object
    , K extends KeyOf<T>
> = PrefixKeys<
    Px
    , Pick<T, K>
>

export type PickAndPrefixKeysAndCapitalise<
    Px extends string
    , T extends object
    , K extends KeyOf<T>
> = PrefixKeys<
    Px
    , CapitaliseKeys<Pick<T, K>>
>

export type PickAndSuffixKeys<
    Sx extends string
    , T extends object
    , K extends KeyOf<T>
> = SuffixKeys<
    Sx
    , Pick<T, K>
>