export type NotificationColor = "blue" | "red"

export interface NotificationInterface {
    id: string,
    text: string,
    color: NotificationColor
} 

export interface NotificationsContextInterface {
    notifications: NotificationInterface[],
    setNotifications: React.Dispatch<React.SetStateAction<NotificationInterface[]>>
}