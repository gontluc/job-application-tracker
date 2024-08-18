"use client"

// Types
import { ApplicationInterface, ApplicationsContextInterface } from "@/types/applications"
import { NotificationsContextInterface } from "@/types/notifications"

// Contexts
import { NotificationsContext } from "@/providers/notifications/notifications"

// React.js
import { createContext, useContext, useEffect, useState } from "react"

// Utils
import { setApplicationsData } from "@/utils/client/applications"
import { DEFAULT_DATA } from "@/utils/client/globals"

// Create Context
export const ApplicationsContext = createContext<ApplicationsContextInterface | undefined>(undefined)

// Constants
const localStorageKey = "applications"

export default function ApplicationsProvider({ children }: Readonly<{
    children: React.ReactNode
}>) {

    const [applications, setApplications] = useState<ApplicationInterface[] | null>(null)

    const notificationsContext = useContext(NotificationsContext) as NotificationsContextInterface

    useEffect(() => {

        const data = localStorage.getItem(localStorageKey)

        // If there is data in local storage
        if (data) {
            setApplicationsData(
                data, {applications, setApplications}, notificationsContext, true
            )

        } else {
            // If no data in local storage then set to default data
            setApplications(DEFAULT_DATA)
        }
        
    }, [])
    
    // Updates local storage on applications context changes
    // Automatically reset local storage with sanitized data (also reset local storage if user manipulated)
    useEffect(() => {
        
        // Will return for null and not for []
        if (!applications) { return }
        
        const dataString = JSON.stringify({
            applications
        })

        localStorage.setItem(localStorageKey, dataString)

    }, [applications])

    return (
        <ApplicationsContext.Provider value={{ applications, setApplications }}>
            {children}
        </ApplicationsContext.Provider>
    )
}