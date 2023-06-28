import { useState, useEffect } from "react"
import styles from "../styles/NftItem.module.css"
import "react-h5-audio-player/lib/styles.css"
import AudioPlayer from "react-h5-audio-player"

function NftItem({ tokenUri, tokenId }) {
    const [metadata, setMetadata] = useState(null)

    // Retrieve metadata from the token URI
    useEffect(() => {
        fetch(tokenUri)
            .then((response) => response.json())
            .then((data) => setMetadata(data))
            .catch((err) => console.error(err))
    }, [tokenUri])

    if (!metadata) {
        return <div>Loading...</div>
    }

    const { track, artist, genre, released, image, audio } = metadata

    return (
        <div className={styles.card}>
            <img
                src={image}
                alt="Cover art"
                style={{ width: "150px", height: "150px", objectFit: "cover", borderRadius: "4px" }}
            />
            <AudioPlayer
                autoPlay
                src={audio}
                onPlay={(e) => console.log("onPlay")}
                showSkipControls={false}
            />
            <h2>{track}</h2>
            <h3>{artist}</h3>
            <p>
                Genre: {genre}
                <br />
                Released: {released}
            </p>
            <a
                href={`https://testnet.ftmscan.com/token/0x95b948dba9cb230eb289080d4c2b4db0a5a7afa1?a=${tokenId}`}
                target="_blank"
                rel="noopener noreferrer"
            >
                View NFT on FtmScan
            </a>
        </div>
    )
}

export default NftItem
