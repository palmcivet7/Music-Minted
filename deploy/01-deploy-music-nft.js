const { verify } = require(".././utils/verify")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy } = deployments
    const { deployer } = await getNamedAccounts()

    const musicNFT = await deploy("MusicNft", {
        from: deployer,
        log: true,
    })

    // await verify(musicNFT.address)

    console.log("MusicNft deployed to:", musicNFT.address)
}

module.exports.tags = ["MusicNft", "all"]
