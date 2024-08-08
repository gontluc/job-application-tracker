/* "use client" */

// Components


// Types


// React.js
import { useRef, useState, useEffect } from "react"

// Style
import styles from "./newComponent.module.scss"

// Assets
import asset from "@/public/favicon.ico"


// Next.js
import Image from "next/image"
import Link from "next/link"

// Functions


// Constants


interface NewComponentProps {
    
}

export default function NewComponent({  }: NewComponentProps) {
    return (
        <div className={styles.container}>
            NewComponent
        </div>
    )
}