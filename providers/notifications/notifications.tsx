"use client"

// Types
import { NotificationInterface, NotificationsContextInterface } from "@/types/notifications"
import { NOTIFICATION_DURATION } from "@/utils/client/globals"

// React.js
import { createContext, useEffect, useRef, useState } from "react"

// Create Context
export const NotificationsContext = createContext<NotificationsContextInterface | undefined>(undefined)

export default function NotificationsProvider({ children }: Readonly<{
    children: React.ReactNode
}>) {

    const [notifications, setNotifications] = useState<NotificationInterface[]>([])

    const prevNotifications = useRef<NotificationInterface[]>([])
    const timeoutsRef = useRef<NodeJS.Timeout[]>([])

    useEffect(() => {
        // Cleanup function when component unmounts
        return () => {
            timeoutsRef.current.forEach(clearTimeout)

            // Prevent memory leaks
            timeoutsRef.current = []
        }
    }, [])

    useEffect(() => {

        if (!notifications) { return }

        // Set timer to remove new notification
        const newNotification = notifications.find((notification) =>
            !prevNotifications.current.includes(notification)
        )

        if (newNotification) {

            const timeout = setTimeout(() => {
                
                setNotifications((prevState) => prevState.filter((notification) =>
                    notification.id !== newNotification.id
                ))

            }, NOTIFICATION_DURATION)

            timeoutsRef.current.push(timeout)

            // Update prevNotifications
            prevNotifications.current = notifications
        }

    }, [notifications])

    return (
        <NotificationsContext.Provider value={{ notifications, setNotifications }}>
            {children}
        </NotificationsContext.Provider>
    )
}