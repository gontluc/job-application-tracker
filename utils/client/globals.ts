// Types
import { ApplicationInterface, ApplicationStatus } from "@/types/applications"
import { SortingType } from "@/types/sort"

// VALIDATION

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
        id: "4b2e356f-1f47-4c2d-9b59-7305e7bff856",
        status: "waiting",
        company: "Tech Innovators Inc.",
        location: "San Francisco, CA",
        email: "hr@techinnovators.com",
        date: "2024-08-15T08:24:24.546Z",
        website: "https://techinnovators.com/careers",
        notes: "Follow up in two weeks.",
    },
    {
        id: "c3f5901e-8e49-4bc2-91d3-7c328b1eb5de",
        status: "progressing",
        company: "Global FinTech",
        location: "New York, NY",
        email: "careers@globalfintech.com",
        date: "2024-08-10T08:24:24.546Z",
        notes: "Scheduled for a second interview.",
    },
    {
        id: "f7d8e8b1-2c41-4baf-9351-445987b0df85",
        status: "rejected",
        company: "AI Solutions Ltd.",
        location: "Austin, TX",
        email: "jobs@aisolutions.com",
        date: "2024-08-12T08:24:24.546Z",
        website: "https://aisolutions.com/jobs",
    },
    {
        id: "a6e8e1f7-bc1a-4d9a-a9e5-53b4c3c1f7f1",
        status: "progressing",
        company: "Innovative Tech Corp",
        location: "Los Angeles, CA",
        email: "apply@innoteccahcorp.com",
        date: "2024-08-18T08:24:24.546Z",
        website: "https://innotechcorp.com/careers",
    }
]

// INITIAL APPLICATION STATUS

export const INITIAL_STATUS: ApplicationStatus = "waiting"

// DEFAULT APPLICATIONS SORTING

export const DEFAULT_SORTING: SortingType = "Latest"

// NOTIFICATION DURATION IN MILISECONDS

export const NOTIFICATION_DURATION = 5_000