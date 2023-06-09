const { ethers } = require("hardhat")
const { assert, expect } = require("chai")

describe("MusicNft", function () {
    let musicNft, accounts

    beforeEach(async function () {
        accounts = await ethers.getSigners()
        deployer = accounts[0]
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

    describe("mintToken function", () => {
        it("fails if there is no token URI", async function () {
            await expect(
                musicNft.connect(deployer).mintToken(deployer.address, "", {
                    value: ethers.utils.parseEther("1"), // sending 1 FTM
                })
            ).to.be.revertedWith("MusicNft__InvalidTokenUri")
        })
        it("reverts if payment amount is less than the mint fee", async function () {
            await expect(
                musicNft.connect(deployer).mintToken(deployer.address, "tokenURI", {
                    value: ethers.utils.parseEther("0"), // sending 0 FTM
                })
            ).to.be.revertedWith("MusicNft__NeedMoreFTMSent")
        })
        it("increments the tokenId after minting a new token", async function () {
            const beforeTokenId = await musicNft.getCurrentTokenId()
            await musicNft.connect(deployer).mintToken(deployer.address, "tokenURI", {
                value: ethers.utils.parseEther("1"), // sending 1 FTM
            })
            const afterTokenId = await musicNft.getCurrentTokenId()
            expect(afterTokenId).to.equal(beforeTokenId + 1)
        })

        // it("sets the correct token URI", async function () {
        //     const tokenUri = "tokenURI"
        //     await musicNft.connect(deployer).mintToken(deployer.address, tokenUri, {
        //         value: ethers.utils.parseEther("1"), // sending 1 FTM
        //     })
        //     const tokenId = await musicNft.getCurrentTokenId() // Get the latest token's ID
        //     const retrievedTokenUri = await musicNft.tokenURI(tokenId)
        //     expect(retrievedTokenUri).to.equal(tokenUri)
        // })
        // it("sets the correct minter", async function () {
        //     await musicNft.connect(deployer).mintToken(deployer.address, "https://tokenuri.com", {
        //         value: ethers.utils.parseEther("1"), // sending 1 FTM
        //     })
        //     const tokenId = await musicNft.getCurrentTokenId()
        //     const minter = await musicNft._minters(tokenId)
        //     expect(minter).to.equal(deployer.address)
        // })
    })
})
