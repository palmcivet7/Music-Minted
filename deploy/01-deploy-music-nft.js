// scripts/deploy.js

const hre = require("hardhat")

async function main() {
    const MusicNFT = await hre.ethers.getContractFactory("MusicNFT")
    const musicNFT = await MusicNFT.deploy()

    await musicNFT.deployed()

    console.log("MusicNFT deployed to:", musicNFT.address)
}

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy } = deployments
    const { deployer } = await getNamedAccounts()

    await deploy("MusicNFT", {
        from: deployer,
        log: true,
    })
}

module.exports.tags = ["MusicNFT"]

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
