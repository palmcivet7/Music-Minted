const { ethers } = require("hardhat")
const { assert } = require("chai")

describe("MusicNft", async function () {
    let musicNft

    beforeEach(async function () {
        const MusicNft = await ethers.getContractFactory("MusicNft")
        musicNft = await MusicNft.deploy()
        await musicNft.deployed()
    })

    it("should have the correct name and symbol", async function () {
        const name = await musicNft.name()
        const symbol = await musicNft.symbol()

        assert.equal(name, "Music Minted")
        assert.equal(symbol, "MM")
    })
})
