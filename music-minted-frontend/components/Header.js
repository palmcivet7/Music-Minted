import { ConnectButton } from "web3uikit"
import Navigation from "./Navigation"
import styles from "../styles/Header.module.css"
// import Link from "next/link"
// import { Button } from "web3uikit"
// import Router from "next/router"

export default function Header() {
    return (
        <div>
            <div className={styles.header}>
                <div className={styles.emptyDiv}></div>
                <h1 className={styles.title}>Music Minted</h1>
                <div className={styles.buttonDiv}>
                    <ConnectButton className={styles.connectButton} />
                </div>
            </div>
            <Navigation />
        </div>
    )
}
