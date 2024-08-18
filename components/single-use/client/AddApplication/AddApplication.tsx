"use client"

// Utils
import { MAX_LENGTH_NOTES, MAX_LENGTH_SHORT_TEXT, MAX_LENGTH_WEBSITE } from "@/utils/client/globals"
import { addApplication } from "@/utils/client/applications"

// Contexts
import { NotificationsContext } from "@/providers/notifications/notifications"
import { ApplicationsContext } from "@/providers/applications/applications"

// Components
import Honeypot from "@/components/reusable/client/Honeypot/Honeypot"
import Input from "@/components/reusable/client/Input/Input"

// Types
import { NotificationsContextInterface } from "@/types/notifications"
import { ApplicationsContextInterface } from "@/types/applications"

// Style
import styles from "./AddApplication.module.scss"

// React.js
import { useRef, useContext } from "react"

export default function AddApplication() {

    const applicationsContext = useContext(ApplicationsContext) as ApplicationsContextInterface
    const notificationsContext = useContext(NotificationsContext) as NotificationsContextInterface

    const formRef = useRef<HTMLFormElement>(null)

    function handleFormAction(formData: FormData) {

        addApplication(formData, applicationsContext, notificationsContext)
        
            .then((isSuccessful) => {
                // Reset form
                if (formRef.current && isSuccessful) {
                    formRef.current.reset()
                }
            })
    }

    return (
        <div className={styles.container}>

            <form ref={formRef} action={handleFormAction} autoComplete="off">

                <Input
                    style="new application"
                    type="text"
                    name="company"
                    text="Company"
                    maxLength={MAX_LENGTH_SHORT_TEXT}
                />

                <Input
                    style="new application"
                    type="text"
                    name="location"
                    text="Location"
                    maxLength={MAX_LENGTH_SHORT_TEXT}
                />

                <Input
                    style="new application"
                    type="email"
                    name="email"
                    text="Email"
                    maxLength={MAX_LENGTH_SHORT_TEXT}
                />

                <Input
                    style="new application"
                    type="url"
                    name="website"
                    text="Website"
                    required={false}
                    maxLength={MAX_LENGTH_WEBSITE}
                />

                <Input
                    style="new application"
                    type="text"
                    name="notes"
                    text="Notes"
                    required={false}
                    maxLength={MAX_LENGTH_NOTES}
                />

                <Honeypot />

                <button
                    type="submit"
                    className={styles.btn}
                    aria-label="Click to add new job application"
                >
                    Add application
                </button>

            </form>

        </div>
    )
}