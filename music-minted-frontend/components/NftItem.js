import { useState, useEffect } from "react"
import { Card } from "web3uikit"
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
        <div style={{ width: "250px" }}>
            <Card
                description={artist}
                title={track}
                onClick={function noRefCheck() {}}
                setIsSelected={function noRefCheck() {}}
            >
                <div className={styles.card}>
                    <img
                        src={image}
                        alt="Cover art"
                        style={{ width: "90px", height: "90px", objectFit: "cover" }}
                    />
                    <p>{genre}</p>
                    <p>{released}</p>
                    <AudioPlayer
                        autoPlay
                        src={audio}
                        onPlay={(e) => console.log("onPlay")}
                        showSkipControls={false}
                    />
                    <a
                        href={`https://testnet.ftmscan.com/token/0x95b948dba9cb230eb289080d4c2b4db0a5a7afa1?a=${tokenId}`}
                        target="blank"
                    >
                        View on FtmScan
                    </a>
                    {/* <a href={`https://ftmscan.com/tx/${tokenUri}`}>View on FtmScan</a> */}
                </div>
            </Card>
        </div>
    )
}

export default NftItem
