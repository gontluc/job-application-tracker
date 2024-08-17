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
import { ApplicationInterface, ApplicationsContextInterface, ApplicationStatus, applicationStatusArray } from "@/types/applications"
import { editApplication, deleteApplication } from "@/utils/client/applications"
import useListenClickOutside from "@/custom-hooks/useListenClickOutside"
import Input from "@/components/reusable/client/Input/Input"
import { DEFAULT_SORTING, MAX_LENGTH_NOTES, MAX_LENGTH_SHORT_TEXT, MAX_LENGTH_WEBSITE } from "@/utils/client/globals"
import { Action, EditApplicationData } from "@/classes/action"
import Honeypot from "@/components/reusable/client/Honeypot/Honeypot"
import { SortingType } from "@/types/sort"
import { sortingFunctions } from "@/utils/client/sort"
import { NotificationsContextInterface } from "@/types/notifications"
import { NotificationsContext } from "@/providers/notifications/notifications"
import pushNotification from "@/utils/client/notifications"
// Functions


// Constants

export default function Applications() {

    const { applications, setApplications } = useContext(ApplicationsContext) as ApplicationsContextInterface
    const notificationsContext = useContext(NotificationsContext) as NotificationsContextInterface

    const [sorting, setSorting] = useState<SortingType>(DEFAULT_SORTING)

    return (
        <div className={styles.container}>

            <OrderBy sorting={sorting} />

            <div className={styles.applicationsContainer}>

                <div className={styles.titles}>
                    <Title
                        name={"Status"}
                        styles={styles.status}
                        sorting={sorting}
                        setSorting={setSorting}
                        titleSortings={[
                            "Status"
                        ]}
                    />
                    <Title
                        name={"Company"}
                        styles={styles.company}
                        sorting={sorting}
                        setSorting={setSorting}
                        titleSortings={[
                            "Company: A-Z",
                            "Company: Z-A"
                        ]}
                    />
                    <Title
                        name={"Location"}
                        styles={styles.location}
                        sorting={sorting}
                        setSorting={setSorting}
                        titleSortings={[
                            "Location: A-Z",
                            "Location: Z-A"
                        ]}
                    />
                    <Title
                        name={"Email"}
                        styles={styles.email}
                        sorting={sorting}
                        setSorting={setSorting}
                        titleSortings={[
                            "Email: A-Z",
                            "Email: Z-A"
                        ]}
                    />
                    <Title
                        name={"Date"}
                        styles={styles.date}
                        sorting={sorting}
                        setSorting={setSorting}
                        titleSortings={[
                            "Oldest",
                            "Latest"
                        ]}
                    />

                    <div className={styles.website}>Website</div>
                    <div className={styles.notes}>Notes</div>

                    <ClipboardEmails />
                </div>

                <div className={styles.subContainer}>

                    {applications?.sort(sortingFunctions[sorting]).map((application) => {
                        return (
                            <Row
                                key={application.id}
                                application={application}
                                applicationsContext={{ applications, setApplications }}
                                notificationsContext={notificationsContext}
                            />
                        )
                    })}

                </div>

            </div>
        </div>
    )
}

function OrderBy({ sorting }: {
    sorting: SortingType
}) {
    return (
        <div className={styles.orderBy}>
            <p>Order by:</p>
            <div className={styles.orderByPill}>{sorting}</div>
        </div>
    )
}

function Title({ name, styles, sorting, setSorting, titleSortings }: {
    name: string,
    styles: string,
    sorting: SortingType,
    setSorting: React.Dispatch<React.SetStateAction<SortingType>>,
    titleSortings: SortingType[]
}) {
    const [action, setAction] = useState<number>(0)

    useEffect(() => {
        // Reset action if not included in titleSortings
        if (!titleSortings.includes(sorting)) {
            setAction(0)
        }
    }, [sorting])

    function handleClick() {
        // Run action
        setSorting(titleSortings[action])

        // Set next action
        if (action + 1 >= titleSortings.length) {
            setAction(0)
        } else {
            setAction(prevState => prevState + 1)
        }
    }

    return (
        <div
            className={styles}
            onClick={handleClick}
        >
            {name}
        </div>
    )
}

function ClipboardEmails() {

    const { applications, setApplications } = useContext(ApplicationsContext) as ApplicationsContextInterface
    const notificationsContext = useContext(NotificationsContext) as NotificationsContextInterface

    function handleCopyEmailsClick() {

        if (!applications) { return }

        const emails = applications?.map((app) => app.email)
        const emailString = emails.join(", ")

        navigator.clipboard.writeText(emailString)
            .then(() => {
                pushNotification(notificationsContext, {
                    text: "Emails copied to clipboard",
                    color: "blue"
                })
                console.log("Emails copied to clipboard")
            })
            .catch((/* error */) => {
                pushNotification(notificationsContext, {
                    text: "Failed to copy emails",
                    color: "red"
                })
                console.error("Failed to copy emails")
            })
    }

    return (
        <div className={styles.copyEmails} onClick={handleCopyEmailsClick}>
            Copy All Emails
        </div>
    )
}

function Row({ application, applicationsContext, notificationsContext }: {
    application: ApplicationInterface,
    applicationsContext: ApplicationsContextInterface,
    notificationsContext: NotificationsContextInterface,
}) {
    const [hovering, setHover] = useState(false)
    const [editting, setEditting] = useState(false)
    const [deletting, setDeletting] = useState(false)
    const [applicationStatus, setApplicationStatus] = useState<ApplicationStatus>(application.status)

    const containerRef = useRef<HTMLDivElement | null>(null)
    const formRef = useRef<HTMLFormElement | null>(null)

    const formId = useId()

    const Edit = new Action(
        //@ts-ignore
        applicationsContext, notificationsContext, application, setEditting, editApplication
    )
    const Delete = new Action(
        //@ts-ignore
        applicationsContext, notificationsContext, application, setDeletting, deleteApplication
    )

    // Listen for clicks outside of container to disable states
    useListenClickOutside(editting, Edit.cancel, containerRef)
    useListenClickOutside(deletting, Delete.cancel, containerRef)

    useEffect(() => {
        // Update state on application changes
        setApplicationStatus(application.status)
    }, [application.status])

    function handleFormAction(formData: FormData) {

        const data = {
            formData: formData,
            status: applicationStatus
        }

        Edit.save(data)

        // Reset form
        if (formRef.current) {
            formRef.current.reset()
        }
    }

    function displayData(data: string | undefined) {
        if (!data) {
            return "-"
        }

        return data
    }

    return (
        <div
            ref={containerRef}
            className={styles.row}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
        >

            {/* Change to form when edditing mode is active */}
            {!editting
                ?
                <>
                    <AppStatus
                        application={application}
                        applicationsContext={applicationsContext}
                        notificationsContext={notificationsContext}
                    />

                    <div className={styles.company}>
                        {displayData(application.company)}
                    </div>

                    <div className={styles.location}>
                        {displayData(application.location)}
                    </div>

                    <div className={styles.email}>
                        {displayData(application.email)}
                    </div>

                    <div className={styles.date}>
                        {displayData(application.date)}
                    </div>

                    <div className={styles.website}>
                        {displayData(application.website)}
                    </div>

                    <div className={styles.notes}>
                        {displayData(application.notes)}
                    </div>
                </>
                :
                <EditRowForm
                    formId={formId}
                    formRef={formRef}
                    application={application}
                    applicationsContext={applicationsContext}
                    notificationsContext={notificationsContext}
                    setApplicationStatus={setApplicationStatus}
                />
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

function AppStatus({ application, applicationsContext, notificationsContext, setApplicationStatus }: {
    application: ApplicationInterface
    applicationsContext: ApplicationsContextInterface,
    notificationsContext: NotificationsContextInterface,
    setApplicationStatus?: React.Dispatch<React.SetStateAction<ApplicationStatus>>
}) {
    const [activeDropdown, setDropdown] = useState(false)
    const [currentStatus, setCurrentStatus] = useState<ApplicationStatus>(application.status)
    const [otherStatus, setOtherStatus] = useState<ApplicationStatus[]>(
        applicationStatusArray.filter(status => status !== application.status)
    )

    const containerRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        setOtherStatus(
            applicationStatusArray.filter(status => status !== currentStatus)
        )
    }, [currentStatus])

    const Status = new Action(
        //@ts-ignore
        applicationsContext, notificationsContext, application, setDropdown, editApplication
    )

    // Listen for clicks outside of container to disable states
    useListenClickOutside(activeDropdown, Status.cancel, containerRef)

    function handleStatusClick(status: ApplicationStatus) {

        // Save directly or change state and wait for form submission
        if (setApplicationStatus) {

            setApplicationStatus(status)
            Status.cancel()

        } else {
            const data: EditApplicationData = {
                status: status
            }
            Status.save(data)
        }

        setCurrentStatus(status)
    }

    return (
        <div ref={containerRef} className={styles.status}>

            <div className={styles.statusContainer}>

                <div onClick={() => Status.toggle()}>
                    {currentStatus}
                </div>


                <div
                    className={styles.selectStatus}
                    style={{ zIndex: activeDropdown ? 10 : -1 }}
                >
                    {otherStatus.map((status) => {
                        return (
                            <div key={status} onClick={() => handleStatusClick(status)}>
                                {status}
                            </div>
                        )
                    })}
                </div>

            </div>

        </div>
    )
}

function EditRowForm({
    formId, formRef, application, applicationsContext, notificationsContext, setApplicationStatus
}: {
    formId: string,
    formRef: React.MutableRefObject<HTMLFormElement | null>,
    application: ApplicationInterface,
    applicationsContext: ApplicationsContextInterface,
    notificationsContext: NotificationsContextInterface,
    setApplicationStatus?: React.Dispatch<React.SetStateAction<ApplicationStatus>>
}) {
    return (
        <form id={formId} ref={formRef} autoComplete="off" className={styles.row}>

            <AppStatus
                application={application}
                applicationsContext={applicationsContext}
                notificationsContext={notificationsContext}
                setApplicationStatus={setApplicationStatus}
            />

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

            <Honeypot />

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