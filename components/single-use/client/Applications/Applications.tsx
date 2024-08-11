"use client"

// Components


// Types


// React.js
import React, { useRef, useState, useEffect, useContext, useId } from "react"

// Style
import styles from "./Applications.module.scss"

// Assets
import asset from "@/public/favicon.ico"


// Next.js
import Image from "next/image"
import Link from "next/link"
import { ApplicationsContext } from "@/providers/applications/applications"
import { ApplicationInterface, ApplicationsContextInterface, FormStateInterface } from "@/types/applications"
import { editApplication, deleteApplication } from "@/utils/client/applicationsActions"
import useListenClickOutside from "@/custom-hooks/useListenClickOutside"
import Input from "@/components/reusable/client/Input/Input"
import { MAX_LENGTH_NOTES, MAX_LENGTH_SHORT_TEXT, MAX_LENGTH_WEBSITE } from "@/utils/client/globals"
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

            <div className={styles.subContainer}>

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

    const [activeListener, setActiveListener] = useState(false)

    const initialState = {
        changedEmail: false,
        changedOriginal: false,
        data: { ...application }
    }

    const [formState, setFormState] = useState<FormStateInterface>(initialState)

    const insideContainerRef = useRef<HTMLDivElement>(null)
    const editContainerRef = useRef<HTMLDivElement>(null)
    const deleteContainerRef = useRef<HTMLDivElement>(null)

    const containerRef = useRef<HTMLDivElement>(null)

    const formRef = useRef<HTMLFormElement>(null)

    const formId = useId()

    const rowContainerId = `Row-${application.id}`

    // Action class
    class Action {
        private setState: React.Dispatch<React.SetStateAction<boolean>>
        private action: (
            context: ApplicationsContextInterface,
            id: string,
            data?: FormStateInterface
        ) => void
        private formState?: FormStateInterface

        constructor(
            setState: React.Dispatch<React.SetStateAction<boolean>>,
            action: (
                context: ApplicationsContextInterface,
                id: string,
                data?: FormStateInterface
            ) => void,
            formState?: FormStateInterface
        ) {
            this.setState = setState
            this.action = action
            this.formState = formState
        }

        private disable = () => {
            this.setState(false)

            // Disable listener click outside container
            setActiveListener(false)
        }

        enable = () => {
            // Activate action mode
            this.setState(true)

            // Activate listener click outside container
            setActiveListener(true)
        }

        save = () => {
            // Run applications action
            if (this.formState) {
                this.action(context, application.id, this.formState)
            } else {
                this.action(context, application.id)
            }

            // Disable mode
            this.disable()
        }

        cancel = () => {
            // Reset form state (in eddited case)
            setFormState(initialState)

            // Disable mode
            this.disable()
        }
    }

    //@ts-ignore
    const Edit = new Action(setEditting, editApplication, formState)
    const Delete = new Action(setDeletting, deleteApplication)

    // Listen for clicks outside of container to disable states
    const insideContainersRefs = [
        insideContainerRef,
        editContainerRef,
        deleteContainerRef
    ]
    useListenClickOutside(editting, Edit.cancel, containerRef)
    useListenClickOutside(deletting, Delete.cancel, containerRef)
    /* useListenClickOutside(
        deletting, Delete.cancel, rowContainerId, insideContainersRefs, activeListener
    )
 */
    function handleFormAction(formData: FormData) {

        Edit.save()

        // Reset form
        if (formRef.current) {
            formRef.current.reset()
        }
    }

    return (
        <div
            ref={containerRef}
            className={styles.row}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
        >

            {/* Transform to form when edditing mode is active */}
            {!editting
                ?
                <>
                    {/* This will later be a component */}
                    <div className={styles.status}>{application.status}</div>

                    <div className={styles.company}>{application.company}</div>
                    <div className={styles.location}>{application.location}</div>
                    <div className={styles.email}>{application.email}</div>
                    <div className={styles.date}>{application.date}</div>
                    <div className={styles.website}>{application.website}</div>
                    <div className={styles.notes}>{application.notes}</div>
                </>
                :
                <>
                    <form id={formId} ref={formRef} autoComplete="off" className={styles.row}>

                        {/* This will later be a component */}
                        <div className={styles.status}>{application.status}</div>

                        <Input
                            style="default"
                            type="text"
                            name="company"
                            text="Company"
                            maxLength={MAX_LENGTH_SHORT_TEXT}
                            value={application.company}
                        />

                        <Input
                            style="default"
                            type="text"
                            name="location"
                            text="Location"
                            maxLength={MAX_LENGTH_SHORT_TEXT}
                            value={application.location}
                        />

                        <Input
                            style="default"
                            type="email"
                            name="email"
                            text="Email"
                            maxLength={MAX_LENGTH_SHORT_TEXT}
                            value={application.email}
                        />

                        <div className={styles.date}>{application.date}</div>

                        <Input
                            style="default"
                            type="url"
                            name="website"
                            text="Website"
                            required={false}
                            maxLength={MAX_LENGTH_WEBSITE}
                            value={application.website}
                        />

                        <Input
                            style="default"
                            type="text"
                            name="notes"
                            text="Notes"
                            required={false}
                            maxLength={MAX_LENGTH_NOTES}
                            value={application.notes}
                        />

                        {/* Honeypot */}
                        <Input
                            style="honeypot"
                            type="text"
                            name="address"
                            text="Address"
                            required={false}
                            maxLength={MAX_LENGTH_SHORT_TEXT}
                        />

                    </form>
                </>
            }

            {/* Edit-Delete Container */}
            {hovering && !editting && !deletting
                ?
                <div className={styles.actionsContainer} ref={insideContainerRef}>
                    <button
                        className={styles.btn}
                        aria-label="Click to edit application"
                        onClick={() => Edit.enable()}
                    >
                        Edit
                    </button>

                    <button
                        className={styles.btn}
                        aria-label="Click to delete application"
                        onClick={() => Delete.enable()}
                    >
                        Delete
                    </button>
                </div>
                :
                null
            }

            {/* Save-Cancel Container */}
            {editting
                ?
                <div className={styles.actionsContainer} ref={editContainerRef}>

                    <button
                        type="submit"
                        form={formId}
                        className={styles.btnGreen}
                        aria-label="Click to save application"
                        formAction={handleFormAction}
                    >
                        Save
                    </button>

                    <button
                        className={styles.btnRed}
                        aria-label="Click to cancel editting"
                        onClick={() => Edit.cancel()}
                    >
                        Cancel
                    </button>

                </div>
                :
                null
            }

            {/* Delete-Cancel Container */}
            {deletting
                ?
                <div className={styles.actionsContainer} ref={deleteContainerRef}>

                    <button
                        className={styles.btnRed}
                        aria-label="Click to confirm to delete application"
                        onClick={() => Delete.save()}
                    >
                        Delete
                    </button>

                    <button
                        className={styles.btnBlue}
                        aria-label="Click to cancel to delete application"
                        onClick={() => Delete.cancel()}
                    >
                        Cancel
                    </button>

                </div>
                :
                null
            }

        </div>
    )
}