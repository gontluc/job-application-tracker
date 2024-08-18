"use client"

// Contexts
import { NotificationsContext } from "@/providers/notifications/notifications"
import { ApplicationsContext } from "@/providers/applications/applications"

// Types
import { NotificationsContextInterface } from "@/types/notifications"
import { ApplicationsContextInterface } from "@/types/applications"
import { FileRejection } from "react-dropzone"

// Utils
import { setApplicationsData } from "@/utils/client/applications"
import pushNotification from "@/utils/client/notifications"
import { MAX_FYLE_SIZE } from "@/utils/client/globals"

// React.js
import { useState, useCallback, useContext } from "react"

// Style
import styles from "./UploadBtn.module.scss"

// React Dropzone
import { useDropzone } from "react-dropzone"

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
const uploadConditionMsg = "Only one *.json* file will be accepted, max size of 3 MB"

export default function UploadBtn() {

    const [isActive, setActive] = useState(false)

    function disablePopUp() {
        setActive(false)
    }

    return (
        <>
            <button 
                className={styles.container} 
                onClick={() => setActive(true)}
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
    return (
        isActive
            ?
            <div className={styles.uploadPopUp}>
                <Dropzone disablePopUp={disablePopUp} />
            </div>
            :
            null
    )
}

function Dropzone({ disablePopUp }: {
    disablePopUp: () => void
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
        <>
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

                            <p>Drag and drop your file here, or click to select file</p>
                            <i>({uploadConditionMsg})</i>

                            <button 
                                className={styles.uploadBtn}
                                aria-label="Click to select file to upload"
                            >
                                Select file
                            </button>

                        </div>
                }
            </div>
        </>
    )
}