"use client"

// Components


// Types


// React.js
import { useRef, useState, useEffect } from "react"

// Style
import styles from "./DownloadBtn.module.scss"

// Assets
import asset from "@/public/favicon.ico"


// Next.js
import Image from "next/image"
import Link from "next/link"

// Functions


// Constants


interface DownloadBtnProps {

}

export default function DownloadBtn({ }: DownloadBtnProps) {

    const [applications, setApplications] = useState([
        {
            company: "abc"
        }
    ])

    // Functions

    function handleClick() {
        // Return if no data
        if (applications.length === 0) { return }

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
            aria-label="Download job applications data as JSON"
        >
            Download
        </button>
    )
}