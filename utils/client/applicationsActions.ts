// Utils
import { validateApplication, validateApplications } from "@/utils/client/validation"
import { DEFAULT_DATA, MAX_APPLICATIONS } from "@/utils/client/globals"
import sanitize from "@/utils/client/sanitization"
import parseData from "@/utils/client/parseData"

// Types
import {
    ApplicationInterface,
    ApplicationsContextInterface,
    ApplicationsDataInteraface,
    ApplicationStatus
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

// Check if email already exists
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

// Check for any repeated emails
function checkAllEmails(applicationsData: ApplicationsDataInteraface): ApplicationsDataInteraface {

    let emails: string[] = []

    // Go through each email and throw error if repeated
    applicationsData.applications.forEach((app) => {

        if (emails.includes(app.email)) {
            throw new Error()
        }

        emails.push(app.email)
    })

    return applicationsData
}

// Check if user changed original application email
function emailWasEditted(applications: ApplicationInterface[], newApplication: ApplicationInterface) {

    const application =
        applications.find((application) => application.id === newApplication.id) as ApplicationInterface

    return application.email !== newApplication.email
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
            const newEdditedApplication = additional.data as ApplicationInterface

            const updatedEdittedApplications = applications.map((application) => {
                if (application.id === id) {
                    return newEdditedApplication
                }
                return application
            })
            setApplications(updatedEdittedApplications)

            console.log("Saved application")
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
    applications: ApplicationInterface[],
    isApplicationEdit: boolean = false,
    applicationEditId?: string,
): Promise<ApplicationInterface> {

    const id = isApplicationEdit
        ? applicationEditId as string
        : crypto.randomUUID()

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

    if (!isApplicationEdit) {
        checkMaxApplications(applications)
    }

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
    data: FormData
) {

    const { applications } = context as {
        applications: ApplicationInterface[]
    }

    processData(data, applications, true, id)

        .then((unvalidatedApplication: ApplicationInterface) => validateApplication(unvalidatedApplication))

        .then((unsanitaziedApplication: ApplicationInterface) => sanitize(unsanitaziedApplication))

        .then((newEdittedApplication: ApplicationInterface) => {
            if (emailWasEditted(applications, newEdittedApplication)) {
                return checkRepeatedEmail(newEdittedApplication, applications)
            }

            return newEdittedApplication
        })

        .then((newEdittedApplication: ApplicationInterface) =>
            updateApplicationsContext("edit", context, { data: newEdittedApplication, id: id })
        )

        .catch((/* error */) => {
            // Failed in a previous step
        })
}

export function deleteApplication(
    context: ApplicationsContextInterface,
    id: string
) {

    updateApplicationsContext("delete", context, { id })
}

export function setApplicationsData(
    data: string,
    context: ApplicationsContextInterface,
    isFirstPageLoad?: boolean
) {

    const { setApplications } = context as {
        setApplications: React.Dispatch<React.SetStateAction<ApplicationInterface[]>>
    }

    parseData(data)

        .then((unvalidatedData: ApplicationsDataInteraface) => validateApplications(unvalidatedData))

        .then((unsanitaziedData: ApplicationsDataInteraface) => sanitize(unsanitaziedData))

        .then((applicationsData: ApplicationsDataInteraface) => checkAllEmails(applicationsData))

        .then((applicationsData: ApplicationsDataInteraface) => {
            const data = applicationsData.applications
            updateApplicationsContext("set", context, { data })
        })

        .catch((/* error */) => {
            // Failed in a previous step

            // Set to default data if it's first page load
            if (isFirstPageLoad) {
                setApplications(DEFAULT_DATA)
            }
        })
}