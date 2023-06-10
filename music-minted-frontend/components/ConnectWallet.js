import { useEffect, useState } from "react"

export default function ConnectWallet() {
    const [account, setAccount] = useState()

    const connectWallet = async () => {
        if (window.ethereum) {
            try {
                const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })
                setAccount(accounts[0])
            } catch (error) {
                console.error("Failed to connect wallet", error)
            }
        } else {
            console.log("Ethereum is not connected. Connect your wallet")
        }
    }

    useEffect(() => {
        if (window.ethereum) {
            window.ethereum.on("accountsChanged", (accounts) => {
                setAccount(accounts[0])
            })
        }
    }, [])

    return (
        <div>
            <button onClick={connectWallet}>Connect Wallet</button>
            {account && <p>Connected: {account}</p>}
        </div>
    )
}
