import styles from "../styles/Paragraph.module.css"

export default function Paragraph() {
    return (
        <div className={styles.paragraph}>
            <p>
                Music Minted is a Fantom-based application for musicians to mint their music into
                NFTs. It costs $1 per mint, and uses Chainlink price feeds to ensure that. When
                files are submitted, the audio and cover art are uploaded to AWS S3, and then
                included in a JSON file along with the other submitted info. This metadata JSON file
                gets passed to the Music Minted NFT contract as the token URI.
            </p>
        </div>
    )
}
