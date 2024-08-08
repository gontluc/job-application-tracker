"use client"

// Types
import { ApplicationsDataInteraface } from "@/types/applications"

// Utils
import { MAX_FYLE_SIZE } from "@/utils/client/globals"
import sanitize from "@/utils/client/sanitization"
import validate from "@/utils/client/validation"

// Types
import { FileRejection } from "react-dropzone"

// React.js
import { useState, useCallback } from "react"

// Style
import styles from "./UploadBtn.module.scss"

// React Dropzone
import { useDropzone } from "react-dropzone"

// Functions

async function parse(dataString: string) {
    try {
        return JSON.parse(dataString)

    } catch (error) {
        console.log("Error parsing JSON")
    }
}

// File Reader API
function readFile(file: File) {

    const reader = new FileReader()

    // Set event handlers
    reader.onabort = () => console.log('file reading was aborted')
    reader.onerror = () => console.log('file reading has failed')
    reader.onload = () => {

        parse(reader.result as string)

            .then((unvalidatedData: unknown) => validate(unvalidatedData))

            .then((unsanitaziedData: ApplicationsDataInteraface) => sanitize(unsanitaziedData))

            /* .then((data: ApplicationsDataInteraface) => updateApplicationsContext(data)) */

            .catch((/* error */) => {
                // Failed in one of the steps
            })
    }

    // Read file
    reader.readAsText(file)
}

// Constants
const uploadConditionMsg = "Only one *.json* file will be accepted, max size of 3 MB"

export default function UploadBtn() {

    const [isActive, setActive] = useState(false)

    return (
        <>
            <button 
                className={styles.container} 
                onClick={() => setActive(true)}
                aria-label="Click to toggle file upload pop-up"
            >
                Upload
            </button>

            <UploadPopUp isActive={isActive} />
        </>
    )
}

function UploadPopUp({ isActive }: {
    isActive: boolean
}) {
    return (
        isActive
            ?
            <div className={styles.uploadPopUp}>
                <Dropzone />
            </div>
            :
            null
    )
}

function Dropzone() {

    // Will be invoked regardless if the dropped files were accepted or rejected
    const onDrop = useCallback((acceptedFiles: File[], fileRejections: FileRejection[]) => {

        // Return if file was rejected based on dropzone conditions:
        // Accepted file types, maxFiles, maxSize
        if (fileRejections.length !== 0) {
            console.log(uploadConditionMsg)
            return
        }

        // Read files
        acceptedFiles.forEach((file) => {

            console.log('File accepted')

            readFile(file)
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