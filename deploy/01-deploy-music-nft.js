const { verify } = require(".././utils/verify")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy } = deployments
    const { deployer } = await getNamedAccounts()

    const priceFeedAddress = "0xf4766552d15ae4d256ad41b6cf2933482b0680dc" // replace with price feed address
    // MockV3Aggregator = 0x5FbDB2315678afecb367f032d93F642f64180aa3
    // FTM/USD FTM TESTNET = 0xe04676B9A9A2973BCb0D1478b5E1E9098BBB7f3D
    // FTM/USD FTM MAINNET = 0xf4766552d15ae4d256ad41b6cf2933482b0680dc

    const musicNFT = await deploy("MusicNft", {
        from: deployer,
        args: [priceFeedAddress],
        log: true,
    })

    // await verify(musicNFT.address)

    console.log("MusicNft deployed to:", musicNFT.address)
}

module.exports.tags = ["MusicNft", "all"]
