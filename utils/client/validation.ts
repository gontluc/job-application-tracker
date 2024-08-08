// Types
import { ApplicationsDataInteraface, applicationStatusArray } from "@/types/applications"

// Zod
import { z } from "zod"

// Constants
const applicationStatusEnum= z.enum(applicationStatusArray)

const schema = z.object({
    applications: z.array(z.object({
        status: applicationStatusEnum,
        company: z.string().max(60),
        email: z.string().email().max(60),
        date: z.string().datetime(),
        website: z.string().url().max(400).optional(),
        notes: z.string().max(1300).optional()
    }))
})

export default function validate(data: unknown): ApplicationsDataInteraface {
    try {
        const validatedData = schema.parse(data)

        console.log('Valid')

        return validatedData

    } catch(error) {

        console.log('Invalid')
        
        throw new Error()
    }
}