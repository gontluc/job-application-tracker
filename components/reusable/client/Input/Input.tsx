"use client"

// Types
import { HTMLInputTypeAttribute } from "react"


// React.js
import { useRef, useState, useEffect, useContext, useId } from "react"

// Style
import styles from "./Input.module.scss"

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

type StylesInputType = "default" | "new application" | "honeypot"

export default function Input({ 
    style="default", type, name, text, required=true, maxLength, value=undefined
}: {
    style: StylesInputType
    type: HTMLInputTypeAttribute,
    name: string,
    text: string,
    required?: boolean,
    maxLength?: number,
    value?: string,
}) {

    const id = useId()

    let containerClassName: string

    switch (style) {
        case "new application":
            containerClassName = styles.containerNewApplication
            break

        case "honeypot":
            containerClassName = styles.specialContainer
            break
        default:
            containerClassName = styles.defaultContainer
    }

    return (
        <div className={containerClassName}>
            <label htmlFor={id}>{text}</label>{/* this is display none?, ask gpt if accessibility still works, if not then change Upload component css too */}
            <input 
                type={type} 
                id={id}
                name={name} 
                required={required}
                maxLength={maxLength}
                aria-hidden={style === "honeypot" ? "true" : undefined}
                defaultValue={value}
            />
        </div>
    )
}