// Types
import { ApplicationInterface, ApplicationsDataInteraface } from "@/types/applications"

// DOM Purify
import DOMPurify from "dompurify"

// Functions

type SanitizeDataType = 
    ApplicationsDataInteraface 
    | ApplicationInterface 
    | string 
    | {[key: string]: any}[] 
    | {[key: string]: any}

function sanitizeData<T extends SanitizeDataType>(data: T): T {

    if (typeof data === 'string') {
        return DOMPurify.sanitize(data) as T

    } else if (Array.isArray(data)) {
        return data.map(item => sanitizeData(item)) as T

    } else if (typeof data === 'object' && data !== null) {

        const sanitizedObject: {
            [key: string]: any
        } = {}

        for (const key in data) {
            //@ts-ignore
            sanitizedObject[key] = sanitizeData(data[key])
        }

        return sanitizedObject as T
    }
    return data
}

type SanitizeType = ApplicationsDataInteraface | ApplicationInterface

export default async function sanitize<T extends SanitizeType>(data: T): Promise<T> {
    try {
        const sanitizedData = sanitizeData(data)

        console.log('Sanitized')

        return sanitizedData

    } catch (error) {

        console.log('Error during sanitization')

        throw new Error()
    }
}