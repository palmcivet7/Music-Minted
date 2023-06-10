import { ConnectButton } from "web3uikit"
import Link from "next/link"
import styles from "../styles/Header.module.css"

export default function Header() {
    return (
        <div className={styles.header}>
            <div className={styles.emptyDiv}></div>
            <h1 className={styles.title}>Music Minted</h1>
            <div className={styles.buttonDiv}>
                <ConnectButton />
            </div>
        </div>
    )
}
