// Utils
import { MAX_APPLICATIONS, MAX_LENGTH_NOTES, MAX_LENGTH_SHORT_TEXT, MAX_LENGTH_WEBSITE } from "@/utils/client/globals"

// Types
import { ApplicationInterface, ApplicationsDataInteraface, applicationStatusArray } from "@/types/applications"

// Zod
import { z, ZodObject } from "zod"

// Functions

type ValidateType = ApplicationInterface | ApplicationsDataInteraface

function validate<T extends ValidateType>(data: T, schema: ZodObject<any>): T {
    try {
        const validatedData = schema.parse(data) as T

        console.log('Valid')

        return validatedData

    } catch(error) {

        console.log('Invalid')
        
        throw new Error("Invalid")
    }
}

// Constants
const applicationStatusEnum= z.enum(applicationStatusArray)

const applicationSchema = z.object({
    id: z.string().max(36),
    status: applicationStatusEnum,
    company: z.string().max(MAX_LENGTH_SHORT_TEXT),
    location: z.string().max(MAX_LENGTH_SHORT_TEXT),
    email: z.string().email().max(MAX_LENGTH_SHORT_TEXT),
    date: z.string().datetime(),
    website: z.string().url().max(MAX_LENGTH_WEBSITE).optional(),
    notes: z.string().max(MAX_LENGTH_NOTES).optional()
})

const applicationsSchema = z.object({
    applications: z.array(applicationSchema).max(MAX_APPLICATIONS)
})

export async function validateApplications(
    data: ApplicationsDataInteraface
): Promise<ApplicationsDataInteraface> {
    return validate(data, applicationsSchema)
}

export async function validateApplication(
    data: ApplicationInterface
): Promise<ApplicationInterface> {
    return validate(data, applicationSchema)
}