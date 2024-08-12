// Both have to be the same
export type ApplicationStatus = "waiting" | "rejected" | "progressing"
export const applicationStatusArray = ["waiting", "rejected", "progressing"] as const

export interface ApplicationInterface {
    id: string,
    status: ApplicationStatus,
    company: string,
    location: string,
    email: string,
    date: string,
    website?: string,
    notes?: string,
}

export interface ApplicationsDataInteraface {
    applications: ApplicationInterface[]
}

export interface ApplicationsContextInterface {
    applications: ApplicationInterface[] | null,
    setApplications: React.Dispatch<React.SetStateAction<ApplicationInterface[] | null>>
}