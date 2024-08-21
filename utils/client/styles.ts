import { ApplicationStatus } from "@/types/applications"

export function getBgColor(
    styles: {
        readonly [key: string]: string
    },
    status: ApplicationStatus
) {
    switch (status) {
        case "waiting":
            return styles.blue
        case "rejected":
            return styles.red
        case "progressing":
            return styles.green
        default:
            // Unreach
    }
}