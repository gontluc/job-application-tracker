/* "use client" */

// Components


// Types


// React.js
import { useRef, useState, useEffect } from "react"

// Style
import styles from "./Main.module.scss"

// Assets
import asset from "@/public/favicon.ico"


// Next.js
import Image from "next/image"
import Link from "next/link"

// Functions


// Constants


interface MainProps {
    
}

export default function Main({  }: MainProps) {
    return (
        <div className={styles.container}>
            Main
        </div>
    )
}