"use client"

// Components


// Types


// React.js
import { useRef, useState, useEffect, useContext } from "react"

// Style
import styles from "./Header.module.scss"

// Assets
import asset from "@/public/favicon.ico"


// Next.js
import Image from "next/image"
import Link from "next/link"
import { ApplicationsContextInterface, ApplicationStatus } from "@/types/applications"
import { ApplicationsContext } from "@/providers/applications/applications"

// Functions


export default function Header() {

    const { applications, setApplications } = useContext(ApplicationsContext) as ApplicationsContextInterface

    const [stats, setStats] = useState<{ [key in ApplicationStatus]: number }>({
        waiting: 0,
        rejected: 0,
        progressing: 0
    })

    useEffect(() => {

        let waiting = 0
        let rejected = 0
        let progressing = 0

        applications?.forEach((app) => {
            switch (app.status) {
                case "waiting":
                    waiting += 1
                    break
                case "rejected":
                    rejected += 1
                    break
                case "progressing":
                    progressing += 1
                    break
                default:
                // Unreachable
            }
        })

        setStats({ waiting, rejected, progressing })

    }, [applications])

    function getPercentage(number: number): string {

        if (applications && applications.length !== 0) {

            const total = applications?.length 

            return ((number / total) * 100).toFixed() + "%"
        }

        return "0" + "%"
    }

    return (
        <div className={styles.container}>

            <div className={styles.subContainer}>
                <div>Waiting</div>
                <div>{stats.waiting}</div>
                <div>{getPercentage(stats.waiting)}</div>
            </div>

            <div className={styles.subContainer}>
                <div>Rejected</div>
                <div>{stats.rejected}</div>
                <div>{getPercentage(stats.rejected)}</div>
            </div>

            <div className={styles.subContainer}>
                <div>Progressing</div>
                <div>{stats.progressing}</div>
                <div>{getPercentage(stats.progressing)}</div>
            </div>
        </div>
    )
}