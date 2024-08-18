// Components
import DownloadBtn from "@/components/single-use/client/DownloadBtn/DownloadBtn"
import UploadBtn from "@/components/single-use/client/UploadBtn/UploadBtn"

// Style
import styles from "./Navbar.module.scss"

export default function Navbar() {
    return (
        <div className={styles.container}>

            <h1 className={styles.logo}>
                JOB APPLICATION TRACKER
            </h1>

            <div className={styles.ctas}>
                <UploadBtn />
                <DownloadBtn />
            </div>

        </div>
    )
}