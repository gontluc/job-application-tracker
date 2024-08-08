// Types
import { ApplicationsDataInteraface } from "@/types/applications"

// DOM Purify
import DOMPurify from "dompurify"

// Functions

type SanitizeDataType = 
    ApplicationsDataInteraface | string | {[key: string]: any}[] | {[key: string]: any}

function sanitizeData(data: SanitizeDataType): SanitizeDataType {

    if (typeof data === 'string') {
        return DOMPurify.sanitize(data)

    } else if (Array.isArray(data)) {
        return data.map(item => sanitizeData(item))

    } else if (typeof data === 'object' && data !== null) {

        const sanitizedObject: {
            [key: string]: any
        } = {}

        for (const key in data) {
            //@ts-ignore
            sanitizedObject[key] = sanitizeData(data[key])
        }

        return sanitizedObject
    }
    return data
}

export default function sanitize(data: ApplicationsDataInteraface): ApplicationsDataInteraface {
    try {
        const sanitizedData = sanitizeData(data) as ApplicationsDataInteraface

        console.log('Sanitized')

        return sanitizedData

    } catch (error) {

        console.log('Error during sanitization')

        throw new Error()
    }
}