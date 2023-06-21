import { useState } from "react"
const ethers = require("ethers")
import AWS from "../config/aws-config"
const s3 = new AWS.S3()
import { contractAbi, contractAddress } from ".././constants/index.js"
import { Button, Modal, Upload, Input, Loading, useNotification } from "web3uikit"
import styles from "../styles/Page.module.css"
import Footer from ".././components/Footer"
import Paragraph from ".././components/Paragraph"

async function uploadFile(file, key) {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("key", key)

    const response = await fetch("http://54.242.213.11:8080/upload", {
        method: "POST",
        body: formData,
    }) // http://localhost:8080/upload

    if (!response.ok) {
        throw new Error("File upload failed")
    }

    const data = await response.json()
    return data.location // Assume the server responds with JSON containing the file's URL in S3
}

// This function connects to the contract and calls the mintToken function.
async function mintNft(metadataUrl, handleMintNotification) {
    try {
        // We're assuming the user has MetaMask installed and is connected to it.
        const provider = new ethers.providers.Web3Provider(window.ethereum)

        // Request account access
        await provider.send("eth_requestAccounts", [])

        // We get the signer (the user's wallet)
        const signer = provider.getSigner()

        // We create a new Contract instance
        const contract = new ethers.Contract(contractAddress, contractAbi, signer)

        // We call the getMintPriceFTM function to get the current mint price
        const mintPriceWei = await contract.getMintPriceFTM()
        const mintPriceEther = ethers.utils.formatEther(mintPriceWei) // convert Wei to Ether

        // We call the mintToken function and pass the metadataUrl
        // We also attach the FTM as value in the transaction
        const tx = await contract.mintToken(metadataUrl, {
            value: ethers.utils.parseEther(mintPriceEther),
        })

        // We wait for the transaction to be mined
        const receipt = await tx.wait()

        // Once the transaction is mined we can consider the NFT minted
        console.log("NFT minted!", metadataUrl)

        // Include the link to the NFT on FtmScan using the transaction hash
        const txHash = receipt.transactionHash
        const link = `https://testnet.ftmscan.com/tx/${txHash}`
        console.log("Check your transaction on FtmScan: ", link)
        handleMintNotification(txHash)
        return receipt
    } catch (error) {
        console.error("There's been an error minting the NFT: ", error)
    }
}

export default function Page() {
    const [checked, setChecked] = useState(false)
    const [formVisible, setFormVisible] = useState(false)
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [audioFile, setAudioFile] = useState()
    const [imageFile, setImageFile] = useState()
    const initialMetadata = {
        track: "",
        artist: "",
        genre: "",
        released: "",
        audio: "",
        image: "",
    }
    const [metadata, setMetadata] = useState(initialMetadata)

    const dispatch = useNotification()
    const [isMinting, setIsMinting] = useState(false)

    const mintNftWithCheck = async () => {
        if (typeof window.ethereum === "undefined") {
            alert("Please install MetaMask first.")
            return
        }

        try {
            await window.ethereum.request({ method: "eth_requestAccounts" })

            // If MetaMask connected successfully, you can open the mint modal
            setIsModalVisible(true)
        } catch (err) {
            // User has denied account access to DApp...
            console.error(err)
            alert("Please allow access to your MetaMask accounts.")
        }
    }

    const handleMintNotification = (txHash) => {
        const link = `https://testnet.ftmscan.com/tx/${txHash}`

        dispatch({
            type: "success",
            message: (
                <p>
                    Minting successful! Check your transaction on FtmScan:
                    <a href={link} target="_blank" rel="noreferrer">
                        {link}
                    </a>
                </p>
            ),
            title: "Minting Completed",
            position: "topR",
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!checked || !audioFile || !imageFile) {
            alert("Please certify the rights, upload an audio file and an image file!")
            return
        }
        if (!audioFile || audioFile.type.indexOf("audio/") !== 0) {
            alert("Please upload a valid audio file!")
            return
        }
        if (!imageFile || !["image/jpeg", "image/png", "image/gif"].includes(imageFile.type)) {
            alert("Please upload a valid image file (jpeg, png, or gif)!")
            return
        }

        setIsModalVisible(false)
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

            await mintNft(metadataUrl, handleMintNotification).catch((error) =>
                console.error("Error minting NFT:", error)
            )
        } catch (error) {
            console.error("File upload failed:", error)
        } finally {
            setMetadata(initialMetadata)
            setChecked(false)
            setIsMinting(false)
        }
    }

    return (
        <div className={styles.content} style={{ backgroundColor: "#ebf8ff" }}>
            <div style={{ height: "100px" }} />
            {!isMinting && !isModalVisible && (
                <Button onClick={mintNftWithCheck} text="Mint NFT" theme="outline" size="xl" />
            )}
            {isMinting && (
                <div className={styles.minting}>
                    <Loading
                        fontSize={12}
                        size={12}
                        spinnerColor="#2E7DAF"
                        spinnerType="wave"
                        text="Minting..."
                    />
                </div>
            )}
            <Modal
                isVisible={isModalVisible && !isMinting}
                onCancel={() => {
                    setMetadata(initialMetadata)
                    setChecked(false)
                    setIsModalVisible(false)
                }}
                onCloseButtonPressed={() => {
                    setMetadata(initialMetadata)
                    setChecked(false)
                    setIsModalVisible(false)
                }}
                okText="Submit"
                title="Create NFT"
                onOk={handleSubmit}
            >
                <div className={styles.form}>
                    <Input
                        label="Track"
                        width="100%"
                        value={metadata.track}
                        onChange={(e) =>
                            setMetadata((prev) => ({ ...prev, track: e.target.value }))
                        }
                        validation={{
                            required: true,
                        }}
                    />
                    <Input
                        label="Artist"
                        width="100%"
                        value={metadata.artist}
                        onChange={(e) =>
                            setMetadata((prev) => ({ ...prev, artist: e.target.value }))
                        }
                        validation={{
                            required: true,
                        }}
                    />
                    <Input
                        label="Genre"
                        width="100%"
                        value={metadata.genre}
                        onChange={(e) =>
                            setMetadata((prev) => ({ ...prev, genre: e.target.value }))
                        }
                        validation={{
                            required: true,
                        }}
                    />
                    <Input
                        label="Year"
                        width="100%"
                        type="number"
                        min="1800"
                        max="2222"
                        value={metadata.released}
                        onChange={(e) =>
                            setMetadata((prev) => ({ ...prev, released: e.target.value }))
                        }
                        validation={{
                            required: true,
                        }}
                    />
                    <div>
                        <p>Upload audio file</p>
                        <Upload
                            onChange={(file) => setAudioFile(file)}
                            theme="textOnly"
                            descriptionText="Only audio files are accepted"
                            acceptedFiles="audio/*"
                        />
                    </div>
                    <div>
                        <p>Upload cover art</p>
                        <Upload
                            onChange={(file) => setImageFile(file)}
                            theme="withIcon"
                            descriptionText="Only image files are accepted"
                            acceptedFiles="image/jpeg, image/png, image/gif"
                        />
                    </div>
                    <div className={styles.certify}>
                        <p>I certify that I own the rights to this music</p>
                        <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => setChecked((prev) => !prev)}
                        />
                    </div>
                </div>
            </Modal>
            <div style={{ height: "100px" }} />
            <Paragraph />
            <Footer />
        </div>
    )
}
