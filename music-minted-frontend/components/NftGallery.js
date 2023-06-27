import { useState, useEffect } from "react"
import { ethers } from "ethers"
import NftItem from "../components/NftItem"
import { contractAbi, contractAddress } from ".././constants/index.js"

const NftGallery = () => {
    const [tokens, setTokens] = useState([])
    const [address, setAddress] = useState("")

    // Connect to the wallet and set the current address
    useEffect(() => {
        const fetchAddress = async () => {
            if (typeof window.ethereum !== "undefined") {
                const provider = new ethers.providers.Web3Provider(window.ethereum)
                const signer = provider.getSigner()
                const addr = await signer.getAddress()
                setAddress(addr)
            }
        }

        fetchAddress()
    }, [])

    useEffect(() => {
        const fetchTokens = async () => {
            try {
                const provider = new ethers.providers.Web3Provider(window.ethereum)
                const contract = new ethers.Contract(contractAddress, contractAbi, provider)
                const totalSupply = await contract.getCurrentTokenId()

                let tempTokens = []
                for (let i = 0; i < totalSupply; i++) {
                    try {
                        let owner = await contract.ownerOf(i)
                        if (owner.toLowerCase() === address.toLowerCase()) {
                            let tokenUri = await contract.tokenURI(i)
                            tempTokens.push({ uri: tokenUri, id: i })
                        }
                    } catch (error) {
                        console.error(`Failed to fetch token with ID ${i}: `, error)
                    }
                }

                setTokens(tempTokens)
            } catch (error) {
                console.error(error)
            }
        }

        if (address) {
            fetchTokens()
        }
    }, [address])

    return (
        <div>
            {tokens.map((token, index) => (
                <NftItem key={index} tokenUri={token.uri} tokenId={token.id} />
            ))}
        </div>
    )
}

export default NftGallery
