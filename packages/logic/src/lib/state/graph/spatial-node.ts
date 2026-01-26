import {
    HasId
    , HasPayload
    , Position
    , Transformation
    , PayloadWithKind
    , GraphNodeWithAnyPayloadAndTransformationMutators,
    GraphNodeWithTransformMutators,
    EventHandlersFromMap,
    KeyOf,
    Size,
    GraphNode
} from "@ns-lab-klx/types"
import {
    createID
    , createTransform
} from "../../factories"
import { action, makeObservable, observable } from "mobx"


// ======================================== events
export type SpatialNodeData =
    Pick<SpatialNode, "size" | "position">

export type SpatialNodeEventsMap = {
    change:
    & {
        k: KeyOf<SpatialNodeData>
        node: SpatialNodeData
    }
}
// ======================================== props
export type SpatialNodeProps
    =
    & Partial<
        & HasId
        & Transformation
        & {
            isObservable: boolean
        }
        & EventHandlersFromMap<SpatialNodeEventsMap>
    >

// ======================================== class
/**
 * * can be [observable]
 * * uses [mobx]
 */
export class SpatialNode
    // implements GraphNode {
    implements GraphNodeWithTransformMutators {

    id: string
    readonly _transformation: Transformation
    get transformation() {
        return { ...this._transformation }
    }
    updateTransformation({
        size
        , position
    }: Partial<Transformation>
    ) {

        ; !size || (this.size = size);
        ; !position || (this.position = position);

    }

    onChange: SpatialNodeProps["onChange"]

    constructor({
        id = createID()
        , position
        , size
        , isObservable
        , onChange
    }: SpatialNodeProps
    ) {

        this.id = id
        this._transformation = createTransform({ size, position })
        this.onChange = onChange

        this._transformation.position

            ;
        if (isObservable) {
            makeObservable(
                this._transformation
                , {
                    position: observable,
                    // updatePosition: action,
                    // updateSize: action,
                })
            makeObservable(
                this
                , {
                    // position: observable,
                    updatePosition: action,
                    updateSize: action,
                })
        }
    }

    private _emit(
        k: KeyOf<SpatialNodeData>
    ) {
        this.onChange?.({
            k
            , node: {
                size: this.size
                , position: this.position
            }
        })
    }

    get position(): Position {
        return { ...this._transformation.position }
    }
    set position({ x, y }: Position) {
        this.updatePosition({ x, y })
    }

    get size() {
        return { ...this._transformation.size }
    }
    set size({ width, height }: Size) {
        this.updateSize({ width, height })
    }


    // so these methods are so that [mobx.action] can be used

    updatePosition(position: Position) {
        this._transformation.position = { ...position }
        this._emit("position")
    }

    updateSize(size: Size) {
        this._transformation.size = { ...size }
        this._emit("size")
    }

}



// // -------------------------------------------------- w/payload - props
// export type SpatialNodeWithPayloadProps<
//     P extends any | PayloadWithKind<any> = unknown
// >
//     =
//     & SpatialNodeProps
//     & HasPayload<P>


// // -------------------------------------------------- w/payload - component
// /**
//  * * can be [observable]
//  * * uses [mobx]
//  */
// export class SpatialNodeWithPayload<
//     P extends any | PayloadWithKind<any> = unknown
// >
//     extends SpatialNode
//     implements GraphNodeWithAnyPayloadAndTransformationMutators<P> {

//     payload: P

//     constructor({
//         payload
//         , ...rest
//     }: SpatialNodeWithPayloadProps<P>
//     ) {
//         super(rest)
//         this.payload = payload
//     }

// }
