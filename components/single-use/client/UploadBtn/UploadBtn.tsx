"use client"

// Contexts
import { NotificationsContext } from "@/providers/notifications/notifications"
import { ApplicationsContext } from "@/providers/applications/applications"

// React.js
import { useState, useCallback, useContext, useRef, RefObject } from "react"

// Custom Hooks
import useListenClickOutside from "@/custom-hooks/useListenClickOutside"

// Types
import { NotificationsContextInterface } from "@/types/notifications"
import { ApplicationsContextInterface } from "@/types/applications"
import { FileRejection } from "react-dropzone"

// Utils
import { setApplicationsData } from "@/utils/client/applications"
import pushNotification from "@/utils/client/notifications"
import { MAX_FYLE_SIZE } from "@/utils/client/globals"

// Assets
import uploadIcon from "@/public/icons/upload.png"
import closeIcon from "@/public/icons/close.png"
import fileIcon from "@/public/icons/file.png"

// Style
import styles from "./UploadBtn.module.scss"

// React Dropzone
import { useDropzone } from "react-dropzone"

// Next.js
import Image from "next/image"

// File Reader API
function readFile(
    file: File,
    applicationsContext: ApplicationsContextInterface,
    notificationsContext: NotificationsContextInterface,
    disablePopUp: () => void
) {

    const reader = new FileReader()

    // Set event handlers
    reader.onabort = () => {
        pushNotification(notificationsContext, {
            text: "Cancelled upload",
            color: "red"
        })
        console.log('file reading was aborted')
    }

    reader.onerror = () => {
        pushNotification(notificationsContext, {
            text: "Error while uploading",
            color: "red"
        })
        console.log('file reading has failed')
    }

    reader.onload = () => {
        console.log('Uploaded!')

        disablePopUp()

        setApplicationsData(reader.result as string, applicationsContext, notificationsContext)
    }

    // Read file
    reader.readAsText(file)
}

// Constants
const uploadConditionMsg = "Only one .json file will be accepted, max 3MB"

export default function UploadBtn() {

    const [isActive, setActive] = useState(false)

    function disablePopUp() {
        setActive(false)
    }

    return (
        <>
            <button
                className={styles.container}
                onClick={(e) => {
                    e.stopPropagation()
                    setActive(true)
                }}
                aria-label="Click to toggle file upload pop-up"
            >
                Upload
            </button>

            <UploadPopUp isActive={isActive} disablePopUp={disablePopUp} />
        </>
    )
}

function UploadPopUp({ isActive, disablePopUp }: {
    isActive: boolean,
    disablePopUp: () => void
}) {
    const containerRef = useRef<HTMLDivElement>(null)

    // Close container if clicked Outside of Dropzone
    useListenClickOutside(isActive, disablePopUp, containerRef)

    return (
        <div
            className={styles.uploadPopUp}
            style={{ zIndex: isActive ? 25 : -1 }}
        >
            <Dropzone disablePopUp={disablePopUp} containerRef={containerRef} />
        </div>
    )
}

function Dropzone({ disablePopUp, containerRef }: {
    disablePopUp: () => void,
    containerRef: RefObject<HTMLDivElement>
}) {

    const applicationsContext = useContext(ApplicationsContext) as ApplicationsContextInterface
    const notificationsContext = useContext(NotificationsContext) as NotificationsContextInterface

    // Will be invoked regardless if the dropped files were accepted or rejected
    const onDrop = useCallback((acceptedFiles: File[], fileRejections: FileRejection[]) => {

        // Return if file was rejected based on dropzone conditions:
        // Accepted file types, maxFiles, maxSize
        if (fileRejections.length !== 0) {
            pushNotification(notificationsContext, {
                text: "Conditions not met",
                color: "red"
            })
            console.log(uploadConditionMsg)
            return
        }

        // Read files
        acceptedFiles.forEach((file) => {
            console.log('File accepted. Uploading...')

            readFile(file, applicationsContext, notificationsContext, disablePopUp)
        })
    }, [])

    // isDragActive is a boolean that detect if user is hovering files over
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        // Callback function 
        onDrop,
        // Accepted file types
        accept: {
            'application/json': ['.json'],
        },
        // Max number of files
        maxFiles: 1,
        // Max file size (in bytes)
        maxSize: MAX_FYLE_SIZE
    })

    return (
        <div ref={containerRef} className={styles.dropzoneOutterContainer}>
            <div className={styles.dropzoneContainer}>

                <Image
                    src={closeIcon}
                    alt="close upload pop-up window"
                    priority={true}
                    quality={100}
                    className={styles.closeIcon}
                    onClick={disablePopUp}
                />

                <label htmlFor="file-upload" className={styles.label}>
                    Drag and drop your file here, or click to select file
                </label>

                <div {...getRootProps({
                    "aria-label": "Drag and drop your file here, or click to select file"
                })} className={styles.dropzone}>

                    <input {...getInputProps({ id: "file-upload" })} />

                    {
                        isDragActive
                            ?
                            <p>Drop your file here</p>
                            :
                            <div className={styles.dropzoneTextContainer}>

                                <div className={styles.uploadTitle}>
                                    <Image
                                        src={uploadIcon}
                                        alt="upload icon"
                                        priority={true}
                                        quality={100}
                                        className={styles.uploadIcon}
                                    />
                                    <h2>Upload your file here</h2>
                                </div>

                                <p>Drag and drop your file here, or click to select file</p>
                                <i>{uploadConditionMsg}</i>

                                <button
                                    className={styles.uploadBtn}
                                    aria-label="Click to select file to upload"
                                >
                                    <Image
                                        src={fileIcon}
                                        alt="file icon"
                                        priority={true}
                                        quality={100}
                                        className={styles.fileIcon}
                                    />
                                    <p>Select file</p>
                                </button>

                            </div>
                    }
                </div>
            </div>
        </div>
    )
}