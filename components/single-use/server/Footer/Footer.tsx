// Assets
import githubIcon from "@/public/icons/github.png"
import lucasIcon from "@/public/icons/lucas.png"

// Style
import styles from "./Footer.module.scss"

// Next.js
import Image from "next/image"
import Link from "next/link"

export default function Footer() {
    return (
        <div className={styles.container}>


            <Link href={"https://lucas-gontijo.vercel.app/"} className={styles.lucas}>
                <Image
                    src={lucasIcon}
                    alt="Lucas Gontijo logo"
                    className={styles.lucasImg}
                    quality={100}
                />
                <p>Lucas Gontijo</p>
            </Link>

            <div className={styles.github}>
                <Link href={"https://github.com/gontluc"}>
                    <Image
                        src={githubIcon}
                        alt="Github logo"
                        className={styles.githubImg}
                        quality={100}
                    />
                </Link>
            </div>

            <div className={styles.text}>
                <p>Table data is stored in local storage</p>
                <p>Download your data to avoid data loss</p>
            </div>

        </div>
    )
}