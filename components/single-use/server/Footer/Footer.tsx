/* "use client" */

// Components


// Types


// React.js
import { useRef, useState, useEffect } from "react"

// Style
import styles from "./Footer.module.scss"

// Assets
import asset from "@/public/favicon.ico"


// Next.js
import Image from "next/image"
import Link from "next/link"

// Functions


// Constants


interface FooterProps {
    
}

export default function Footer({  }: FooterProps) {
    return (
        <div className={styles.container}>
            Footer
        </div>
    )
}