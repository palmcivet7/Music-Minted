const hre = require("hardhat")
const { verify } = require(".././utils/verify")

async function main() {
    const MusicNFT = await hre.ethers.getContractFactory("MusicNft")
    const musicNFT = await MusicNFT.deploy()

    const musicNftDeployed = await musicNFT.deployed()

    await verify(musicNftDeployed.address)

    console.log("MusicNft deployed to:", musicNFT.address)
}

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy } = deployments
    const { deployer } = await getNamedAccounts()

    await deploy("MusicNft", {
        from: deployer,
        log: true,
    })
}

module.exports.tags = ["MusicNft"]

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
