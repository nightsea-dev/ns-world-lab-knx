import { ReactNode, useEffect, useId, useState } from "react"
import { Button, ButtonGroup, FileType, Input, Loader, Modal, Uploader, UploaderProps } from "rsuite"
import { EventHandlersFromMap, ImageWithKind, PickRestPartial } from "@ns-lab-knx/types"
import { _effect, _use_state, ObjectView, ShowInfo } from "@ns-lab-knx/web"
import { ImageRenderer } from "./ImageRenderer"
import { InputViewButtonGroup } from "./InputViewButtonGroup"


// ======================================== helpers
const _stripExt = (filename: string) => filename.replace(/\.[^.]+$/, "")

    , _toKey = ({ name, size, lastModified } = {} as File) => !name ? undefined : [name, size, lastModified].join("|")

export const _getFileTypeUrl = (file?: File) => !file ? undefined : URL.createObjectURL(file)



// ======================================== events
export type ImageUploaderEventsMap = {
    cancel: {}
    done: {
        fileList: FileType[]
    }
}

// ======================================== types
type ImageUploaderStatus = | "IDLE"
    | "PROCESSING"
    | "SELECTING IMAGES"
    | "SEEKING"

// ======================================== props
export type ImageUploaderProps =
    Partial<
        & {
            message: ReactNode
        }
        & EventHandlersFromMap<ImageUploaderEventsMap>
    >


// ======================================== component
export const ImageUploader = ({
    message = "Click to upload or drag an image"
    , onCancel
    , onDone
}: ImageUploaderProps
) => {

    const id = useId()

        , [state, _set_state, _set_state_async] = _use_state({
            fileList: [] as FileType[]
            , status: "IDLE" as ImageUploaderStatus
            , showInfo: false
        })

        , _handleDone = () => {
            const { fileList } = state
            onDone?.({
                fileList//: state.fileList.map(o => _fromFileTypeToImageWithKind(o)!)
            })
            onCancel?.()
        }

        , _handleChange: UploaderProps["onChange"] = (
            fileList
        ) => {
            _set_state_async({
                status: "PROCESSING"
            }).then((state) => {

                const seenKeys = new Set(
                    state.fileList.map(({ blobFile }) => _toKey(blobFile)!).filter(Boolean)
                )
                    , newFileTypes = fileList.filter(({
                        blobFile
                    }) => {
                        const k = _toKey(blobFile)
                        return !k
                            ? false
                            : !seenKeys.has(k)
                    })

                if (!newFileTypes.length) {
                    return
                }


                _set_state(p => ({
                    ...p,
                    fileList: [
                        ...p.fileList
                        , ...newFileTypes
                    ]
                }))


            }).finally(() => {
                _set_state_async({
                    status: "IDLE"
                })
            })

        }

        , _handleClear = (
            ...fileList: FileType[]
        ) => {

            if (!fileList.length) {
                if (!(fileList = state.fileList).length) {
                    return
                }
            }
            debugger
            fileList.forEach(({
                blobFile
            }) => {
                const src = _getFileTypeUrl(blobFile)
                    ; !src || URL.revokeObjectURL(src)
            })
            _set_state({
                fileList: []
            })
        }

        , _handleRemove: UploaderProps["onRemove"] = ({
            blobFile
        }) => {

            if (!blobFile) {
                return
            }

            const k = _toKey(blobFile)!
                , {
                    fileList
                } = state
                , [item] = fileList.splice(
                    fileList.findIndex(({ blobFile }) => _toKey(blobFile) === k)
                    , 1
                )
            if (!item) {
                return
            }
            debugger
            _handleClear(item)
        }


    _effect([], () => {
        return () => {
            _handleClear()
        }
    })


    return (
        <div
            id={id}
            className="h-full w-full flex flex-col gap-4 p-6"
        >
            {state.status !== "IDLE"
                && <Modal
                    backdrop={false}
                    centered
                    keyboard={false}
                    container={() => document.getElementById(id)!}
                >
                    <Loader />
                </Modal>}
            <InputViewButtonGroup
                showInfoName="ImageInput"
                isDisabled={{
                    clear: !state.fileList.length
                    , done: !state.fileList.length
                }}
                onCancel={onCancel}
                onClear={() => _handleClear()}
                onDone={_handleDone}
                onShowInfoChange={_set_state}
            />
            <Uploader
                action=""
                autoUpload={false}
                multiple
                draggable
                accept="image/*"
                fileList={state.fileList}
                className="cursor-default"
                style={{
                    cursor: "default"
                }}
                onBeforeInput={ev => {
                    console.log("onBeforeInput", ev)
                    debugger
                }}
                // onBeforeInput={ev => {
                //     console.log("onBeforeInput", ev)
                //     debugger
                // }}
                // onInput={ev => {
                //     console.log("onInput", ev)
                //     debugger
                // }}
                // onLoad={ev => {
                //     console.log("onLoad", ev)
                //     debugger
                // }}
                // onLoadStart={ev => {
                //     console.log("onLoadStart", ev)
                //     debugger
                // }}
                // onSeeking={ev => {
                //     console.log("onSeeking", ev)
                //     debugger
                // }}
                // onBlur={ev => {
                //     console.log("onBlur", ev)
                //     debugger
                // }}
                // onUpload={ev => {
                //     console.log("onUpload", ev)
                //     debugger
                // }}
                onChange={_handleChange}
                onRemove={_handleRemove}
                renderFileInfo={(
                    fileType
                    , fileElement
                ) => {
                    const {
                        blobFile
                    } = fileType ?? {}
                    return (
                        !blobFile
                            ? fileElement
                            : <ImageRenderer
                                data={{
                                    name: blobFile.name
                                    , src: _getFileTypeUrl(blobFile)!
                                }}
                            />
                    )
                }}

            >
                <div style={{
                    height: 200
                    , display: 'flex'
                    , alignItems: 'center'
                    , justifyContent: 'center'
                }}>
                    <span>{message}</span>
                </div>
            </Uploader>
            {state.showInfo && <ObjectView
                data={state}
                relative
            />}
            {/* <ImageGrid
                data={state.fileInputItems}
                noData={(
                    <div
                        className="text-gray-500"
                    >
                        No images selected
                    </div>
                )}
            /> */}


        </div >
    )
}
