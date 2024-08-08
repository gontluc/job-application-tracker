/* "use client" */

// Components


// Types


// React.js
import { useRef, useState, useEffect } from "react"

// Style
import styles from "./Header.module.scss"

// Assets
import asset from "@/public/favicon.ico"


// Next.js
import Image from "next/image"
import Link from "next/link"

// Functions


// Constants


interface HeaderProps {
    
}

export default function Header({  }: HeaderProps) {
    return (
        <div className={styles.container}>
            Header
        </div>
    )
}