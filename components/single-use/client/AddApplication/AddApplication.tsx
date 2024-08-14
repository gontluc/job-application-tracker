"use client"

// Types
import { HTMLInputTypeAttribute } from "react"

// React.js
import { useRef, useState, useEffect, useContext, useId } from "react"

// Style
import styles from "./AddApplication.module.scss"

// Assets
import asset from "@/public/favicon.ico"


// Next.js
import Image from "next/image"
import Link from "next/link"

// Utils
import { addApplication } from "@/utils/client/applicationsActions" 

// Contexts
import { ApplicationsContext } from "@/providers/applications/applications"
import { MAX_LENGTH_NOTES, MAX_LENGTH_SHORT_TEXT, MAX_LENGTH_WEBSITE } from "@/utils/client/globals"
import { ApplicationsContextInterface } from "@/types/applications"
import Input from "@/components/reusable/client/Input/Input"
import Honeypot from "@/components/reusable/client/Honeypot/Honeypot"

export default function AddApplication() {

    const context = useContext(ApplicationsContext) as ApplicationsContextInterface

    const formRef = useRef<HTMLFormElement>(null)

    function handleFormAction(formData: FormData) {

        addApplication(formData, context)

        // Reset form
        if (formRef.current) {
            formRef.current.reset()
        }
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