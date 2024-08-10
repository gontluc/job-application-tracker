// Components
import AddApplication from "@/components/single-use/client/AddApplication/AddApplication"
import Applications from "@/components/single-use/client/Applications/Applications"

// Style
import styles from "./Main.module.scss"

export default function Main() {
    return (
        <div className={styles.container}>
            <AddApplication />
            <Applications />
        </div>
    )
}