"use client"

// Components


// Types


// React.js
import React, { useRef, useState, useEffect, useContext } from "react"

// Style
import styles from "./Applications.module.scss"

// Assets
import asset from "@/public/favicon.ico"


// Next.js
import Image from "next/image"
import Link from "next/link"
import { ApplicationsContext } from "@/providers/applications/applications"
import { ApplicationInterface, ApplicationsContextInterface } from "@/types/applications"
import { editApplication, deleteApplication } from "@/utils/client/applicationsActions"
import useListenClickOutside from "@/custom-hooks/useListenClickOutside"
// Functions


// Constants


export default function Applications() {

    const {
        applications, setApplications
    } = useContext(ApplicationsContext) as ApplicationsContextInterface

    return (
        <div className={styles.container}>

            <div className={styles.titles}>
                <div className={styles.status}>Status</div>
                <div className={styles.company}>Company</div>
                <div className={styles.location}>Location</div>
                <div className={styles.email}>Email</div>
                <div className={styles.date}>Date</div>
                <div className={styles.website}>Website</div>
                <div className={styles.notes}>Notes</div>
            </div>

            {applications?.map((application) => {
                return (
                    <Row
                        key={application.id}
                        application={application}
                        context={{ applications, setApplications }}
                    />
                )
            })}

        </div>
    )
}

function Row({ application, context }: {
    application: ApplicationInterface,
    context: ApplicationsContextInterface
}) {
    const [hovering, setHover] = useState(false)
    const [editting, setEditting] = useState(false)
    const [deletting, setDeletting] = useState(false)

    const insideContainerRef = useRef<HTMLDivElement>(null)
    const editContainerRef = useRef<HTMLDivElement>(null)
    const deleteContainerRef = useRef<HTMLDivElement>(null)

    const rowContainerId = `Row-${application.id}`

    // Action class
    class Action {
        private setState: React.Dispatch<React.SetStateAction<boolean>>
        private action: (
            id: string,
            context: ApplicationsContextInterface,
            data?: ApplicationInterface
        ) => void

        constructor(
            setState: React.Dispatch<React.SetStateAction<boolean>>,
            action: (
                id: string,
                context: ApplicationsContextInterface,
                data?: ApplicationInterface
            ) => void
        ) {
            this.setState = setState
            this.action = action
        }

        enable = () => {
            // Activate action mode
            this.setState(true)
        }

        save = (data?: ApplicationInterface) => {
            // Run applications action
            if (data) {
                this.action(application.id, context, data)
            } else {
                this.action(application.id, context)
            }

            // Disable mode
            this.setState(false)
        }

        cancel = () => {
            // Reset form state (in eddited case)

            // Disable mode
            this.setState(false)
        }
    }

    //@ts-ignore
    const Edit = new Action(setEditting, editApplication)
    const Delete = new Action(setDeletting, deleteApplication)

    // Listen for clicks outside of container to disable states
    const insideContainersRefs = [
        insideContainerRef,
        editContainerRef,
        deleteContainerRef
    ]
    useListenClickOutside(editting, Edit.cancel, rowContainerId, insideContainersRefs)
    useListenClickOutside(deletting, Delete.cancel, rowContainerId, insideContainersRefs)

    return (
        <div
            id={rowContainerId}
            className={styles.row}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
        >

            <div className={styles.status}>{application.status}</div>
            <div className={styles.company}>{application.company}</div>
            <div className={styles.location}>{application.location}</div>
            <div className={styles.email}>{application.email}</div>
            <div className={styles.date}>{application.date}</div>
            <div className={styles.website}>{application.website}</div>
            <div className={styles.notes}>{application.notes}</div>

            {hovering && !editting && !deletting
                ?
                <div ref={insideContainerRef}>
                    <div className={styles.btn} onClick={() => Edit.enable()}>
                        Edit
                    </div>

                    <div className={styles.btn} onClick={() => Delete.enable()}>
                        Delete
                    </div>
                </div>
                :
                null
            }

            {editting
                ?
                <div ref={editContainerRef}>
                    <div className={styles.btnGreen} onClick={() => Edit.save()}>
                        Save
                    </div>

                    <div className={styles.btnRed} onClick={() => Edit.cancel()}>
                        Cancel
                    </div>
                </div>
                :
                null
            }

            {deletting
                ?
                <div ref={deleteContainerRef}>
                    <div className={styles.btnRed} onClick={() => Delete.save()}>
                        Delete
                    </div>

                    <div className={styles.btnBlue} onClick={() => Delete.cancel()}>
                        Cancel
                    </div>
                </div>
                :
                null
            }

        </div>
    )
}