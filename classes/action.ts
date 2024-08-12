import { 
    ApplicationInterface, ApplicationsContextInterface 
} from "@/types/applications"

export class Action {
    private context: ApplicationsContextInterface
    private application: ApplicationInterface
    private setState: React.Dispatch<React.SetStateAction<boolean>>
    private action: (
        context: ApplicationsContextInterface,
        id: string,
        data?: FormData
    ) => void

    constructor(
        context: ApplicationsContextInterface,
        application: ApplicationInterface,
        setState: React.Dispatch<React.SetStateAction<boolean>>,
        action: (
            context: ApplicationsContextInterface,
            id: string,
            data?: FormData
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

    save = (formData?: FormData) => {
        // Run applications action
        if (formData) {
            this.action(this.context, this.application.id, formData)
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
}