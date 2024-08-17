"use client"

// Contexts
import { NotificationsContext } from "@/providers/notifications/notifications"

// Types
import { NotificationsContextInterface } from "@/types/notifications"

// Utils
import { NOTIFICATION_DURATION } from "@/utils/client/globals"

// Style
import styles from "./Notifications.module.scss"

// React.js
import { useContext } from "react"

export default function Notifications() {

    const { notifications } = useContext(NotificationsContext) as NotificationsContextInterface

    return (
        <div className={styles.container}>

            {notifications.map((notification) => {

                return (
                    <div
                        key={notification.id}
                        className={styles.subContainer}
                        style={{
                            animationDuration: `${NOTIFICATION_DURATION / 1000}s`,
                            backgroundColor: styles[notification.color]
                        }}
                    >
                        {notification.text}
                    </div>
                )
            })}

        </div>
    )
}