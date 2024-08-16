import { 
    ApplicationInterface, ApplicationsContextInterface, 
    ApplicationStatus
} from "@/types/applications"

export interface EditApplicationData {
    formData?: FormData,
    status?: ApplicationStatus
}

export class Action {
    private context: ApplicationsContextInterface
    private application: ApplicationInterface
    private setState: React.Dispatch<React.SetStateAction<boolean>>
    private action: (
        context: ApplicationsContextInterface,
        id: string,
        data?: EditApplicationData
    ) => void

    constructor(
        context: ApplicationsContextInterface,
        application: ApplicationInterface,
        setState: React.Dispatch<React.SetStateAction<boolean>>,
        action: (
            context: ApplicationsContextInterface,
            id: string,
            data?: EditApplicationData
        ) => void
    ) {
        this.context = context
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
            this.action(this.context, this.application.id, data)
        } else {
            this.action(this.context, this.application.id)
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