// Types
import { ApplicationInterface, ApplicationStatus } from "@/types/applications"
import { SortingType } from "@/types/sort"

// Status

const statusOrder: {[key in ApplicationStatus]: number} = {
    "progressing": 0,
    "waiting": 1,
    "rejected": 2,
}

function statusSorting(a: ApplicationInterface, b: ApplicationInterface) {
    return statusOrder[a.status] - statusOrder[b.status]
}

// Company, Location, Email

type TextSortingPropertyType = Exclude<keyof ApplicationInterface, "id" | "website" | "notes">

function textSorting<P extends TextSortingPropertyType>(
    order: "A-Z" | "Z-A", 
    property: P
) {

    return (a: ApplicationInterface, b: ApplicationInterface) => {

        const propertyA = a[property]
        const propertyB = b[property]

        if (propertyA < propertyB) return order === "A-Z" ? -1 : 1
        if (propertyA > propertyB) return order === "A-Z" ? 1 : -1
        // Equal names
        return 0
    }
}

// Date

function dateOldestSorting(a: ApplicationInterface, b: ApplicationInterface) {
    return (new Date(a.date)).getTime() - (new Date(b.date)).getTime()
}

function dateLatestSorting(a: ApplicationInterface, b: ApplicationInterface) {
    return (new Date(b.date)).getTime() - (new Date(a.date)).getTime()
}

export const sortingFunctions: {
    [key in SortingType]: undefined | ((a: ApplicationInterface, b: ApplicationInterface) => number)
} = {
    "Status": statusSorting,
    "Company: A-Z": textSorting("A-Z", "company"),
    "Company: Z-A": textSorting("Z-A", "company"),
    "Location: A-Z": textSorting("A-Z", "location"),
    "Location: Z-A": textSorting("Z-A", "location"),
    "Email: A-Z": textSorting("A-Z", "email"),
    "Email: Z-A": textSorting("Z-A", "email"),
    "Oldest": dateOldestSorting,
    "Latest": dateLatestSorting
}