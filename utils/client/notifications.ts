// Contexts
import { NotificationColor, NotificationInterface, NotificationsContextInterface } from "@/types/notifications"

export default function pushNotification(
    context: NotificationsContextInterface, 
    notification: {
        text: string,
        color: NotificationColor
    }

) {
    const { setNotifications } = context

    const { text, color } = notification

    const id = crypto.randomUUID()

    const newNotification: NotificationInterface = {
        id,
        text,
        color
    }

    setNotifications((prevState) => [
        ...prevState,
        newNotification
    ])
}