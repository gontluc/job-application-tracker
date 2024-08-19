"use client"

// Types
import { HTMLInputTypeAttribute } from "react"

// Style
import styles from "./Input.module.scss"

// React.js
import { useId } from "react"

type StylesInputType = "default" | "new application" | "honeypot"

export default function Input({ 
    style="default", type, name, text, required=true, maxLength, value
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
            <label htmlFor={id}>{text}</label>
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