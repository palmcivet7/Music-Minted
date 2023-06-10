import { useState } from "react"
const ethers = require("ethers")
import ConnectWallet from "../components/ConnectWallet"
import AWS from "../config/aws-config"
const s3 = new AWS.S3()
import { contractAbi, contractAddress } from ".././constants/index.js"
// const { Web3Provider } = require("@ethersproject/providers")

async function uploadFile(file, key) {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("key", key)

    const response = await fetch("http://localhost:8080/upload", {
        method: "POST",
        body: formData,
    })

    if (!response.ok) {
        throw new Error("File upload failed")
    }

    const data = await response.json()
    return data.location // Assume the server responds with JSON containing the file's URL in S3
}

// This function connects to the contract and calls the mintToken function.
async function mintNft(metadataUrl) {
    try {
        // We're assuming the user has MetaMask installed and is connected to it.
        const provider = new ethers.providers.Web3Provider(window.ethereum)

        // Request account access
        await provider.send("eth_requestAccounts", [])

        // We get the signer (the user's wallet)
        const signer = provider.getSigner()

        // We create a new Contract instance
        const contract = new ethers.Contract(contractAddress, contractAbi, signer)

        // We call the mintToken function and pass the metadataUrl
        // We also attach the FTM as value in the transaction
        const weiValue = ethers.utils.parseEther("1") // converts 1 FTM to wei
        const tx = await contract.mintToken(metadataUrl, { value: weiValue })

        // We wait for the transaction to be mined
        await tx.wait()

        // Once the transaction is mined we can consider the NFT minted
        console.log("NFT minted!", metadataUrl)
    } catch (error) {
        console.error("There's been an error minting the NFT: ", error)
    }
}

export default function Page() {
    const [checked, setChecked] = useState(false)
    const [formVisible, setFormVisible] = useState(false)
    const [audioFile, setAudioFile] = useState()
    const [imageFile, setImageFile] = useState()
    const [metadata, setMetadata] = useState({
        track: "",
        artist: "",
        genre: "",
        released: "",
        audio: "",
        image: "",
    })

    const [isMinting, setIsMinting] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!checked || !audioFile || !imageFile) {
            alert("Please certify the rights, upload an audio file and an image file!")
            return
        }

        setIsMinting(true)

        try {
            // Generate unique keys for the files
            const audioKey = `audio/${Date.now()}-${audioFile.name}`
            const imageKey = `image/${Date.now()}-${imageFile.name}`

            // Upload files and get their URLs
            const audioUrl = await uploadFile(audioFile, audioKey)
            const imageUrl = await uploadFile(imageFile, imageKey)

            // Add the URLs to the metadata
            const finalMetadata = {
                ...metadata,
                audio: audioUrl,
                image: imageUrl,
            }

            // Generate a key for the metadata file
            const metadataKey = `metadata/${Date.now()}-metadata.json`

            // Convert the metadata to a JSON string
            const metadataFile = new Blob([JSON.stringify(finalMetadata)], {
                type: "application/json",
            })

            // Upload the metadata file and get its URL
            const metadataUrl = await uploadFile(metadataFile, metadataKey)

            console.log("Submitted!", { finalMetadata, audioUrl, imageUrl, metadataUrl })

            mintNft(metadataUrl).catch((error) => console.error("Error minting NFT:", error))
        } catch (error) {
            console.error("File upload failed:", error)
        } finally {
            setIsMinting(false)
        }
    }

    return (
        <div>
            <h1>Music Minted</h1>
            <ConnectWallet />
            <button onClick={() => setFormVisible(true)}>Mint NFT</button>
            {formVisible && (
                <div>
                    <button
                        onClick={() => setFormVisible(false)}
                        style={{ position: "absolute", right: 0 }}
                    >
                        X
                    </button>
                    <p>I certify I own the rights to this music</p>
                    <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => setChecked((prev) => !prev)}
                    />

                    <input
                        type="file"
                        accept="audio/*"
                        onChange={(e) => setAudioFile(e.target.files[0])}
                    />

                    <input
                        type="file"
                        accept="image/jpeg, image/png, image/gif"
                        onChange={(e) => setImageFile(e.target.files[0])}
                    />

                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            value={metadata.track}
                            onChange={(e) =>
                                setMetadata((prev) => ({ ...prev, track: e.target.value }))
                            }
                            placeholder="Track"
                        />
                        <input
                            type="text"
                            value={metadata.artist}
                            onChange={(e) =>
                                setMetadata((prev) => ({ ...prev, artist: e.target.value }))
                            }
                            placeholder="Artist"
                        />
                        <input
                            type="text"
                            value={metadata.genre}
                            onChange={(e) =>
                                setMetadata((prev) => ({ ...prev, genre: e.target.value }))
                            }
                            placeholder="Genre"
                        />
                        <input
                            type="number"
                            min="1800"
                            max="2222"
                            value={metadata.released}
                            onChange={(e) =>
                                setMetadata((prev) => ({ ...prev, released: e.target.value }))
                            }
                            placeholder="Year"
                        />

                        <button type="submit" disabled={isMinting}>
                            {isMinting ? "Minting..." : "Submit"}
                        </button>
                    </form>
                </div>
            )}
        </div>
    )
}
