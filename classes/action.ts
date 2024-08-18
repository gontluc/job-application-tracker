// Types
import { NotificationsContextInterface } from "@/types/notifications"
import {
    ApplicationsContextInterface,
    ApplicationInterface, 
    ApplicationStatus
} from "@/types/applications"

export interface EditApplicationData {
    formData?: FormData,
    status?: ApplicationStatus
}

export class Action {
    private applicationsContext: ApplicationsContextInterface
    private notificationsContext: NotificationsContextInterface
    private application: ApplicationInterface
    private setState: React.Dispatch<React.SetStateAction<boolean>>
    private action: (
        applicationsContext: ApplicationsContextInterface,
        notificationsContext: NotificationsContextInterface,
        id: string,
        data?: EditApplicationData
    ) => void

    constructor(
        applicationsContext: ApplicationsContextInterface,
        notificationsContext: NotificationsContextInterface,
        application: ApplicationInterface,
        setState: React.Dispatch<React.SetStateAction<boolean>>,
        action: (
            applicationsContext: ApplicationsContextInterface,
            notificationsContext: NotificationsContextInterface,
            id: string,
            data?: EditApplicationData
        ) => void
    ) {
        this.applicationsContext = applicationsContext
        this.notificationsContext = notificationsContext
        this.application = application
        this.setState = setState
        this.action = action
    }

    private disable = () => {
        this.setState(false)
    }

    enable = () => {
        // Activate action mode
        this.setState(true)
    }

    save = (data?: EditApplicationData) => {
        // Run applications action
        if (data) {
            this.action(this.applicationsContext, this.notificationsContext, this.application.id, data)
        } else {
            this.action(this.applicationsContext, this.notificationsContext, this.application.id)
        }

        // Disable mode
        this.disable()
    }

    cancel = () => {
        // Disable mode
        this.disable()
    }

    toggle = () => {
        this.setState((prevState) => !prevState)
    }
}