"use client"

// Components


// Types


// React.js
import React, { useRef, useState, useEffect, useContext, useId, forwardRef } from "react"

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
import Input from "@/components/reusable/client/Input/Input"
import { MAX_LENGTH_NOTES, MAX_LENGTH_SHORT_TEXT, MAX_LENGTH_WEBSITE } from "@/utils/client/globals"
import { Action } from "@/classes/action"
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

    const containerRef = useRef<HTMLDivElement | null>(null)
    const formRef = useRef<HTMLFormElement | null>(null)

    const formId = useId()

    //@ts-ignore
    const Edit = new Action(context, application, setEditting, editApplication)
    const Delete = new Action(context, application, setDeletting, deleteApplication)

    // Listen for clicks outside of container to disable states
    useListenClickOutside(editting, Edit.cancel, containerRef)
    useListenClickOutside(deletting, Delete.cancel, containerRef)

    function handleFormAction(formData: FormData) {

        Edit.save(formData)

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
                <EditRowForm formId={formId} formRef={formRef} application={application} />
            }

            <EditDelete
                actions={{ Edit, Delete }}
                condition={hovering && !editting && !deletting}
            />

            {/* Edit */}
            <SaveCancel
                formId={formId}
                handleFormAction={handleFormAction}
                condition={editting}
                Edit={Edit}
            />

            {/* Delete */}
            <DeleteCancel
                condition={deletting}
                Delete={Delete}
            />

        </div>
    )
}

function EditRowForm({ formId, formRef, application }: {
    formId: string,
    formRef: React.MutableRefObject<HTMLFormElement | null>,
    application: ApplicationInterface
}) {
    return (
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
    )
}

function EditDelete({
    actions: { Edit, Delete },
    condition
}: {
    actions: {
        Edit: Action,
        Delete: Action
    },
    condition: boolean
}) {

    return (
        <div
            className={styles.actionsContainer}
            style={{ zIndex: condition ? 10 : -1 }}
        >
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
    )
}

function SaveCancel({ formId, handleFormAction, condition, Edit }: {
    formId: string,
    handleFormAction: (formData: FormData) => void,
    condition: boolean,
    Edit: Action
}) {
    return (
        <div
            className={styles.actionsContainer}
            style={{ zIndex: condition ? 10 : -1 }}
        >

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
    )
}

function DeleteCancel({ condition, Delete }: {
    condition: boolean,
    Delete: Action
}) {
    return (
        <div
            className={styles.actionsContainer}
            style={{ zIndex: condition ? 10 : -1 }}
        >

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
    )
}