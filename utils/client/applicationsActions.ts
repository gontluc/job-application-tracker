// Utils
import { validateApplication, validateApplications } from "@/utils/client/validation"
import { MAX_APPLICATIONS } from "@/utils/client/globals"
import sanitize from "@/utils/client/sanitization"
import parseData from "@/utils/client/parseData"

// Types
import { 
    ApplicationInterface, 
    ApplicationsContextInterface, 
    ApplicationsDataInteraface, 
    ApplicationStatus, 
    FormStateInterface
} from "@/types/applications"

// Check honey pot
function checkHoneypot(honeypot: string): void {
    
    if (honeypot) {
        console.log('Not human activity detected')
        throw new Error()
    }
}

// Check if reached max applications
function checkMaxApplications(applications: ApplicationInterface[]): void {

    if (applications.length >= MAX_APPLICATIONS) {
        console.log('Reached max number of applications')
        throw new Error()
    }
}

// Check if applications have the same email
function checkRepeatedEmail(
    newApplication: ApplicationInterface, applications: ApplicationInterface[]
): ApplicationInterface {
    const emails = applications.map((app) => {
        return app.email
    })

    if (emails.includes(newApplication.email)) {
        console.log("Email already exists")
        throw new Error()
    }

    return newApplication
}

// Update applications context
function updateApplicationsContext(
    action: "add" | "edit" | "delete" | "set",
    context: ApplicationsContextInterface,
    // Additional parameters
    additional: {
        data?: ApplicationInterface | ApplicationInterface[],
        id?: string
    }
) {

    const { applications, setApplications } = context as {
        applications: ApplicationInterface[],
        setApplications: React.Dispatch<React.SetStateAction<ApplicationInterface[]>>
    }

    const id = additional.id as string

    switch (action) {

        case "add":
            const newApplication = additional.data as ApplicationInterface
            setApplications(prevState => [...prevState, newApplication])

            console.log("Added new application")
            break

        case "edit":
            const updatedEdittedApplications = []
            break

        case "delete":
            const updatedDeletedApplications = applications.filter((application) => application.id !== id)
            setApplications(updatedDeletedApplications)

            console.log('Deleted application')
            break

        case "set":
            const data = additional.data as ApplicationInterface[]
            setApplications(data)

            console.log("Updated data")
            break

        default:
            console.log("No action was selected")
    }
}

async function processData(
    data: FormData, 
    applications: ApplicationInterface[]
): Promise<ApplicationInterface> {

    const id = crypto.randomUUID()
    const status: ApplicationStatus = "waiting"
    const date = (new Date()).toISOString()

    const company = data.get("company") as string
    const location = data.get("location") as string
    const email = data.get("email") as string
    const website = data.get("website") as string
    const notes = data.get("notes") as string

    const honeypot = data.get("address") as string

    const newApplication: ApplicationInterface = {
        // New props
        id,
        status,
        date,
        // Required props
        company,
        location,
        email,
        // Optional props, only include if defined
        ...(website !== "" && { website }),
        ...(notes !== "" && { notes })
    }

    checkMaxApplications(applications)

    checkHoneypot(honeypot)

    return newApplication
}

export function addApplication(
    data: FormData,
    context: ApplicationsContextInterface
): void {

    const { applications } = context as {
        applications: ApplicationInterface[]
    }

    processData(data, applications)

        .then((unvalidatedApplication: ApplicationInterface) => validateApplication(unvalidatedApplication))

        .then((unsanitaziedApplication: ApplicationInterface) => sanitize(unsanitaziedApplication))

        .then((newApplication: ApplicationInterface) => checkRepeatedEmail(newApplication, applications))

        .then((newApplication: ApplicationInterface) => 
            updateApplicationsContext("add", context, { data: newApplication })
        )

        .catch((/* error */) => {
            // Failed in a previous step
        })

}

export function editApplication(
    context: ApplicationsContextInterface,
    id: string, 
    data: FormStateInterface
) {
    
    /* const newApplications = applications.map((application) => {
        if (application.id !== id) {
            return 
        }

        return application
    })

    updateApplicationsContext("edit", setApplications, newApplications) */
}

export function deleteApplication(
    context: ApplicationsContextInterface,
    id: string
) {

    updateApplicationsContext("delete", context, { id })
}

export function setApplicationsData(
    data: string,
    context: ApplicationsContextInterface
) {

    parseData(data)

        .then((unvalidatedData: ApplicationsDataInteraface) => validateApplications(unvalidatedData))

        .then((unsanitaziedData: ApplicationsDataInteraface) => sanitize(unsanitaziedData))

        .then((applicationsData: ApplicationsDataInteraface) => {
            const data = applicationsData.applications
            updateApplicationsContext("set", context, { data })
        })

        .catch((/* error */) => {
            // Failed in a previous step
        })
}