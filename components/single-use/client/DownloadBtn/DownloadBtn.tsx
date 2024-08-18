"use client"

// Contexts
import { NotificationsContext } from "@/providers/notifications/notifications"
import { ApplicationsContext } from "@/providers/applications/applications"

// Types
import { NotificationsContextInterface } from "@/types/notifications"
import { ApplicationInterface } from "@/types/applications"

// Utils
import pushNotification from "@/utils/client/notifications"

// Style
import styles from "./DownloadBtn.module.scss"

// React.js
import { useContext } from "react"

export default function DownloadBtn() {

    const { applications } = useContext(ApplicationsContext) as {
        applications: ApplicationInterface[]
    }

    const notificationsContext = useContext(NotificationsContext) as NotificationsContextInterface

    function handleClick() {
        // Return if no data
        if (applications.length === 0) { 
            pushNotification(notificationsContext, {
                text: "No data to download, please add an application",
                color: "red"
            })
            console.log("No data to download, please add an application")
            return 
        }

        // Convert to JSON string
        const dataString = JSON.stringify({
            applications: applications
        })

        // Create a Blob
        const blob = new Blob([dataString], { type: "application/json" })

        // Create a link element
        const link = document.createElement('a')

        // Set the download attribute with a filename
        link.download = 'job-applications.json' 

        // Create a URL for the Blob and set it as the href attribute
        link.href = window.URL.createObjectURL(blob)

        // Append the link to the body (it won’t be visible)
        document.body.appendChild(link)

        // Trigger the download by simulating a click
        link.click()

        // Clean up and remove the link
        link.parentNode?.removeChild(link)
    }

    return (
        <button 
            className={styles.container} 
            onClick={handleClick}
            aria-label="Click to download job applications data as JSON"
        >
            Download
        </button>
    )
}