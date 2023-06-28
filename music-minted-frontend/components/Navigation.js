import Link from "next/link"
import styles from "../styles/Page.module.css"

export default function Navigation() {
    return (
        <div className={styles.navigation}>
            <Link href="/" className={styles.link}>
                Home
            </Link>
            <Link href="/gallery" className={styles.link}>
                View NFTs
            </Link>
        </div>
    )
}
