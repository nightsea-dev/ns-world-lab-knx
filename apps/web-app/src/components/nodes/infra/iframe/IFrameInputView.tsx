import { useEffect, useState } from "react"
import { Button, ButtonGroup, Header, Input, Panel, StatHelpText } from "rsuite"
import { EventHandler, EventHandlersFromMap, HasData, HasEventHandler, HasId, IFrame, ImageWithKind, KeyOf } from "@ns-lab-knx/types"
import { InputViewButtonGroup } from "../media/InputViewButtonGroup"
import { faker } from "@faker-js/faker"
import { _cn, _effect, _isValidUrl, _memo, _tw, _use_state, NoData, ObjectView } from "@ns-lab-knx/web"
import { createID, entriesOf, keysOf } from "@ns-lab-knx/logic"

// ======================================== helpers 
const FAKE_FACTORIES = {
    name: faker.commerce.product
    , url: faker.internet.url
} as {
        [k in KeyOf<IFrameDataItem>]: () => IFrameDataItem[k]
    }

    , CSS = {
        button_span: _tw`font-bold px-1 text-[16px]`
    }

type IFrameDataItemKey = KeyOf<
    Pick<IFrameDataItem, "name" | "url">
>

const IFRAME_DATA_ITEM_KEYS
    = ["name", "url"] as IFrameDataItemKey[]

    , _createIFrameDataItem = (
        partial = {} as Partial<
            Pick<
                IFrameDataItem
                , "name" | "url"
            >
        >
    ) => ({
        id: createID()
        , name: FAKE_FACTORIES.name()
        , url: FAKE_FACTORIES.url()
        , ...partial
    } as IFrameDataItem)

    , _isEmptyData = <
        T extends Partial<IFrameDataItem>
    >(o?: T) => !o || IFRAME_DATA_ITEM_KEYS.every(k => o[k] === undefined || o[k] === null)

    , _isIncompleteData = <
        T extends Partial<IFrameDataItem>
    >(o?: T) => o && IFRAME_DATA_ITEM_KEYS.some(k => !!o[k] && o[k] !== undefined && o[k] !== null)

    , _isCompleteData = <
        T extends Partial<IFrameDataItem>
    >(o?: T) =>
        o
        && IFRAME_DATA_ITEM_KEYS.every(k => !!o[k] && o[k] !== undefined && o[k] !== null)
        && _isValidUrl(o.url)


// ======================================== types
type HandleChangeFn = (
    partial?: Partial<IFrameDataItem>
) => void

export type IFrameDataItem =
    & HasId
    & {
        name: string
        url: string
    }

export type HasIFrameDataItem
    = HasData<IFrameDataItem>


// ======================================== props - IFrameDataItem
export type IFrameDataItemProps =
    & HasData<IFrameDataItem>
    & {
        idx: number
    }
    & Partial<HasEventHandler<"remove", HasIFrameDataItem>>

// ======================================== component - IFrameDataItem
export const IFrameDataItem = ({
    data
    , idx
    , onRemove
}: IFrameDataItemProps
) => (
    <div
        data-result-data-item
        className="
        flex items-center gap-3
        ---rounded-md 
        border border-gray-100
        px-3 py-2
        bg-white
        cursor-default
        hover:bg-gray-100
        duration-[.2s]
        transition-all
      "
    >
        {/* index */}
        <div className="text-xs text-gray-400 w-6 text-right">
            {idx + 1}
        </div>

        {/* name */}
        <div className="flex-1 min-w-0">
            <div className="text-sm font-medium truncate">
                {data.name || "—"}
            </div>
            <div className="text-xs text-gray-500 truncate">
                {data.url}
            </div>
        </div>

        {/* optional actions slot */}
        {onRemove
            && <Button
                appearance="subtle"
                size="xs"
                onClick={() => onRemove({ data })}
            >Remove</Button>}
    </div>
)

    , IFrameDataItemGroup = ({
        data
        , onRemove
    }: & HasData<IFrameDataItem[]>
        & Pick<IFrameDataItemProps, "onRemove">
    ) => {
        return (
            <div
                data-iframe-data-item-group
                className={`
                    border border-gray-200 rounded-md overflow-auto
                    min-h-[20vh]
                    max-h-[50vh]
                    `}
            >
                <div
                    className="bg-gray-100 p-2"
                >
                    IFrameDataItems [{data.length}]
                </div>
                <div
                    className="p-2"
                >
                    {
                        !data.length
                            ? <NoData />
                            : data.map((o, idx) => (
                                <IFrameDataItem
                                    key={o.id}
                                    data={o}
                                    idx={idx}
                                    onRemove={onRemove}
                                />
                            ))}
                </div>
            </div>
        )
    }

// ======================================== component - FakeButtons
const FakeButtons = ({
    onChange
}: { onChange: HandleChangeFn }
) => (
    <div
        className="min-w-0 overflow-x-auto whitespace-nowrap"
    >
        <ButtonGroup
            className={`
                border-[1px] rounded-[10px] border-gray-200
                flex flex-nowrap
                overflow-x-auto
                whitespace-nowrap
                cursor-default
            `}
        >
            {entriesOf(FAKE_FACTORIES)
                .map(([k, fn]) => {
                    return (
                        <Button
                            key={k}
                            appearance="subtle"
                            className="cursor-default"
                            onClick={() => onChange({
                                [k]: fn()
                            })}
                        >
                            Create
                            <span
                                className={CSS.button_span}
                            >{k}</span>
                        </Button>
                    )
                })}
            <Button
                appearance="subtle"
            >
                Create <span
                    className={CSS.button_span}
                    onClick={() => {
                        onChange(
                            _createIFrameDataItem()
                        )
                    }}
                >IFrameDataItem</span>
            </Button>
        </ButtonGroup>
    </div>
)
// ======================================== events - IFrameInputView
export type IFrameInputViewEventsMap = {
    cancel: {}
    done: HasData<IFrameDataItem[]>
}

// ======================================== props - IFrameInputView
export type IFrameInputViewProps =
    Partial<
        & EventHandlersFromMap<IFrameInputViewEventsMap>
    >


// ======================================== component - FakeButtons
export const IFrameInputView = ({
    onDone
    , onCancel
}: IFrameInputViewProps) => {

    const [state, _set_state] = _use_state({
        resultData: [] as IFrameDataItem[]
        , currentData: undefined as Partial<IFrameDataItem> | undefined
        , showInfo: false
        , isValidUrl: false
    })

        , _validateUrl = () => {

            const isValidUrl = _isValidUrl(state.currentData?.url)

            console.log({
                isValidUrl
            })

            _set_state({
                isValidUrl
            })
        }

        , _handleRemove: IFrameDataItemProps["onRemove"] = ({
            data
        }) => {

            const {
                resultData
            } = state

                , [item] = resultData.splice(
                    resultData.findIndex(o => o.id === data.id)
                    , 1
                )

            if (!item) {
                return
            }

            _set_state({
                resultData: [...resultData]
            })

        }

        , _handleAddData = () => {

            if (!_isCompleteData(state.currentData)) {
                return
            }

            const {
                resultData
                , currentData
            } = state

            if (!_isCompleteData(currentData)) {
                return
            }

            resultData.push(
                _createIFrameDataItem(currentData)
            )
            _set_state({
                resultData: [...resultData]
                , currentData: undefined
            })

        }

        , _handleClear = () => {
            _set_state({
                resultData: []
                , currentData: undefined
            })

        }

        , _handleDone = () => {
            debugger
            const { resultData: data } = state
            onDone?.({ data })
            onCancel?.()
        }

        , _handleChange: HandleChangeFn = (
            partial
        ) => {
            _set_state(p => ({
                ...p
                , currentData: {
                    ...p.currentData
                    , ...partial
                }
            }))
            setTimeout(_validateUrl)
        }

        , _handleKeyUp = (
            ev: React.KeyboardEvent<HTMLInputElement>
        ) => {
            if (ev.key !== "Enter") {
                return
            }
            _handleAddData()
        }

    _effect([], () => {
        return () => {
            _set_state({
                currentData: undefined
                , resultData: []
            })
        }
    })

    return (
        <div
            data-iframe-input-view
            className="h-full w-full flex flex-col gap-4 p-6"
        >
            <InputViewButtonGroup
                showInfoName="ImageInput"
                isDisabled={{
                    clear: !state.resultData.length
                    , done: !state.resultData.length
                }}
                onCancel={onCancel}
                onClear={_handleClear}
                onDone={_handleDone}
                onShowInfoChange={_set_state}
            />
            <div className="text-lg font-medium">
                <div>
                    <div
                        className="text-[14px]"
                    >
                        Name
                    </div>
                    <Input
                        type="text"
                        value={state.currentData?.name ?? ""}
                        placeholder="Name"
                        onChange={name => _handleChange({ name })}
                        onKeyUp={_handleKeyUp}
                    // style={{
                    //     width: "75%"
                    // }}
                    />
                </div>
                <div>
                    <div
                        className={_cn(
                            "text-[14px]"
                            , !state.isValidUrl ? "text-red-500" : undefined
                        )}
                    // style={{
                    //     // color: !state.isValidUrl ? "red" : undefined
                    // }}
                    >
                        Url
                    </div>
                    <Input
                        type="text"
                        value={state.currentData?.url ?? ""}
                        placeholder="Url"
                        onChange={url => _handleChange({ url })}
                        onKeyUp={_handleKeyUp}
                        onBlur={_validateUrl}
                    />
                </div>
                <div
                    className={`
                        p-2 grid grid-cols-[1fr_auto] items-center gap-2
                        `}
                >
                    <FakeButtons
                        onChange={_handleChange}
                    />
                    <div>
                        <Button
                            appearance="subtle"
                            onClick={() => _set_state({
                                currentData: undefined
                            })}
                            disabled={!_isIncompleteData(state.currentData)}
                        >
                            Clear
                        </Button>
                        <Button
                            appearance="primary"
                            onClick={_handleAddData}
                            disabled={!_isCompleteData(state.currentData)}
                        >
                            Add
                        </Button>
                    </div>
                </div>
            </div>

            <IFrameDataItemGroup
                data={state.resultData}
                onRemove={_handleRemove}
            />
            {/* <div
                data-result-data-container
            >
                {state.resultData.map((o, idx) => {
                    return (
                        <IFrameDataItem
                            data={o}
                            idx={idx}
                            onRemove={_handleRemove}
                        />
                    )
                })}
            </div> */}
            {state.showInfo
                && <ObjectView
                    data={state}
                    header="state-info"
                />}

        </div>
    )
}
