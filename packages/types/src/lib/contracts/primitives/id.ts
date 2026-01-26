export type ID = string
export type Uuid = string


export type HasId = {
    id: ID
}

export type HasPartialId = Partial<HasId>

export type HasUuid = {
    uuid: Uuid
}