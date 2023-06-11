// components/Footer.js
import React from "react"
import styles from "../styles/Footer.module.css"

const Footer = () => {
    return (
        <footer className={styles.footer}>
            <p>
                &copy; {new Date().getFullYear()} Music Minted by{" "}
                <a
                    href="https://blockscan.com/address/0xe0141DaBb4A8017330851f99ff8fc34aa619BBFD"
                    target="_blank"
                    className={styles.text}
                >
                    palmcivet.eth
                </a>
                . All rights reserved.
            </p>
        </footer>
    )
}

export default Footer
