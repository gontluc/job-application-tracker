// Components
import Notifications from "@/components/single-use/client/Notifications/Notifications"
import Navbar from "@/components/single-use/server/Navbar/Navbar"
import Header from "@/components/single-use/server/Header/Header"
import Footer from "@/components/single-use/server/Footer/Footer"
import Main from "@/components/single-use/server/Main/Main"

// Styles
import styles from "@/styles/pages/page.module.scss"

export default function Home() {
    return (
        <div className={styles.container}>
            <Notifications />
            <Navbar />
            <Header />
            <Main />
            <Footer />
        </div>
    )
}
