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
                    type="text" 
                    name="company" 
                    text="Company" 
                    maxLength={MAX_LENGTH_SHORT_TEXT}
                />

                <Input 
                    type="text" 
                    name="location" 
                    text="Location"
                    maxLength={MAX_LENGTH_SHORT_TEXT}
                />

                <Input 
                    type="email" 
                    name="email" 
                    text="Email"
                    maxLength={MAX_LENGTH_SHORT_TEXT}
                />

                <Input 
                    type="url" 
                    name="website" 
                    text="Website" 
                    required={false} 
                    maxLength={MAX_LENGTH_WEBSITE}
                />

                <Input 
                    type="text" 
                    name="notes" 
                    text="Notes" 
                    required={false} 
                    maxLength={MAX_LENGTH_NOTES}
                />

                {/* Honeypot */}
                <Input 
                    type="text" 
                    name="address" 
                    text="Address" 
                    required={false} 
                    maxLength={MAX_LENGTH_SHORT_TEXT}
                    honeypot={true}
                />

                <button 
                    type="submit"
                    className={styles.btn}
                >
                    Add application
                </button>

            </form>

        </div>
    )
}

function Input({ type, name, text, required = true, maxLength, honeypot = false }: {
    type: HTMLInputTypeAttribute,
    name: string,
    text: string,
    required?: boolean,
    maxLength?: number,
    honeypot?: boolean
}) {

    const id = useId()

    return (
        <div className={honeypot ? styles.specialClass : undefined}>
            <label htmlFor={id}>{text}</label>{/* this is display none?, ask gpt if accessibility still works, if not then change Upload component css too */}
            <input 
                type={type} 
                id={id}
                name={name} 
                required={required}
                maxLength={maxLength}
                aria-hidden={honeypot ? "true" : undefined}
            />
        </div>
    )
}