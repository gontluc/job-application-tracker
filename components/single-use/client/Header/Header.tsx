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
                text="waiting"
                number={stats.waiting}
                percentage={getPercentage(stats.waiting)}
            />

            <Stat
                text="rejected"
                number={stats.rejected}
                percentage={getPercentage(stats.rejected)}
            />

            <Stat
                text="progressing"
                number={stats.progressing}
                percentage={getPercentage(stats.progressing)}
            />

        </div>
    )
}

function Stat({ text, number, percentage }: {
    text: ApplicationStatus,
    number: number,
    percentage: string
}) {

    function getBgColor(status: ApplicationStatus) {
        switch (status) {
            case "waiting":
                return styles.blue
            case "rejected":
                return styles.red
            case "progressing":
                return styles.green
            default:
                // Unreach
        }
    }

    return (
        <div className={styles.stat}>

            <div className={styles.pill} style={{ backgroundColor: getBgColor(text) }}></div>
            
            <div className={styles.number}>{number}</div>

            <div className={styles.text}>{text}</div>

            <div className={styles.line}></div>

            <div className={styles.percentage}>{percentage}</div>

            <div className={styles.bottomText}>of total applications</div>
            
        </div>
    )
}