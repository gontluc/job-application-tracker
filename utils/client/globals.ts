// VALIDATION

import { ApplicationInterface, ApplicationStatus } from "@/types/applications"

// Max file size for JSON file (in bytes) (1 KB === 1024 bytes)
// 1 row <= 2.14KB bytes 
// 1.000 rows === 2.191.360 bytes
// Next round number: 3 MB === 3.145.728 bytes
export const MAX_FYLE_SIZE = 3_145_728

// Max array size of applications context
export const MAX_APPLICATIONS = 1_000

// Max string length

// Inputs: Company, Location, Email
export const MAX_LENGTH_SHORT_TEXT = 60

// Inputs: Website
export const MAX_LENGTH_WEBSITE = 400

// Inputs: Notes
export const MAX_LENGTH_NOTES = 1300


// DEFAULT TABLE DATA

export const DEFAULT_DATA: ApplicationInterface[] = [
    {
        id: "123",
        status: "waiting",
        company: "Lorem ipsum dolor sit, amet consectetur adipisicing elit.",
        location: "Earth - Universe",
        email: "companyemailcompampanyemail@companyemailcompanyemail.com",
        date: "2024-08-07T13:44:25.804Z",
        website: "https://www.websitewebsitewebsitewebsitewebsitewebsitewebsitewebsitewebsitewebsitewebsitewebsitewebsitewebsitewebsitewebsitewebsitewebsitewebsitewebsitewebsitewebsitewebsitewebsitewebsitewebsitewebsitewebsitewebsitewebsiteweewebsitewebsitewebsitewebsitewebsitewebsitewebsitewebsitewebsitewebsitewebsitewebsitewebsitewebsitewebsitewebsitewebsitewebsitewebsitewebsitewebsite.com",
        notes: "-"
    }
]

// INITIAL APPLICATION STATUS

export const INITIAL_STATUS: ApplicationStatus = "waiting"