import Moralis from "moralis"
import { MoralisProvider } from "react-moralis"
import Header from ".././components/Header"
import Head from "next/head"
import { NotificationProvider } from "web3uikit"

export default function App({ Component, pageProps }) {
    return (
        <div>
            <Head>
                <title>Music Minted</title>
                <meta name="description" content="An application for minting music NFTs" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <MoralisProvider initializeOnMount={false}>
                <NotificationProvider>
                    <Header />
                    <Component {...pageProps} />
                </NotificationProvider>
            </MoralisProvider>
        </div>
    )
}
