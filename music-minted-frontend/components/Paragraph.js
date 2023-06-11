import styles from "../styles/Paragraph.module.css"

export default function Paragraph() {
    return (
        <div className={styles.paragraph}>
            <p>
                Music Minted is an application for musicians to mint their music into nfts. It costs
                $1 per mint, and uses Chainlink price feeds to ensure that. When files are
                submitted, the audio and cover art are uploaded to AWS S3, and are then included in
                a json file along with the other submitted info. This metadata json file gets passed
                to the nft contract as the token uri.
            </p>
        </div>
    )
}
