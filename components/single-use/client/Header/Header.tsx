"use client"

// Types
import { ApplicationsContextInterface, ApplicationStatus } from "@/types/applications"

// Contexts
import { ApplicationsContext } from "@/providers/applications/applications"

// React.js
import { useState, useEffect, useContext } from "react"

// Style
import styles from "./Header.module.scss"

export default function Header() {

    const { applications } = useContext(ApplicationsContext) as ApplicationsContextInterface

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

            <Stat
                text="Waiting"
                number={stats.waiting}
                percentage={getPercentage(stats.waiting)}
            />

            <Stat
                text="Rejected"
                number={stats.rejected}
                percentage={getPercentage(stats.rejected)}
            />

            <Stat
                text="Progressing"
                number={stats.progressing}
                percentage={getPercentage(stats.progressing)}
            />

        </div>
    )
}

function Stat({ text, number, percentage }: {
    text: string,
    number: number,
    percentage: string
}) {
    return (
        <div className={styles.stat}>
            <div>{text}</div>
            <div>{number}</div>
            <div>{percentage}</div>
        </div>
    )
}