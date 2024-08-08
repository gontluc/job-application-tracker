// Both have to be the same
export type ApplicationStatus = "waiting" | "rejected" | "progressing"
export const applicationStatusArray = ["waiting", "rejected", "progressing"] as const

export interface ApplicationInterface {
    status: ApplicationStatus,
    company: string,
    email: string,
    date: string,
    website?: string,
    notes?: string,
}

export interface ApplicationsDataInteraface {
    applications: ApplicationInterface[]
}