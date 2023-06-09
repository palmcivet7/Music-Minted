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
                musicNft.connect(deployer).mintToken("", {
                    value: ethers.utils.parseEther("1"), // sending 1 FTM
                })
            ).to.be.revertedWith("MusicNft__InvalidTokenUri")
        })
        it("reverts if payment amount is less than the mint fee", async function () {
            await expect(
                musicNft.connect(deployer).mintToken("tokenURI", {
                    value: ethers.utils.parseEther("0"), // sending 0 FTM
                })
            ).to.be.revertedWith("MusicNft__NeedMoreFTMSent")
        })
        it("increments the tokenId after minting a new token", async function () {
            const beforeTokenId = await musicNft.getCurrentTokenId()
            await musicNft.connect(deployer).mintToken("tokenURI", {
                value: ethers.utils.parseEther("1"), // sending 1 FTM
            })
            const afterTokenId = await musicNft.getCurrentTokenId()
            expect(afterTokenId).to.equal(beforeTokenId + 1)
        })

        it("emits an event and sets the correct token URI and minter", async function () {
            const tokenUri = "tokenURI"
            const mintTx = await musicNft.connect(deployer).mintToken(tokenUri, {
                value: ethers.utils.parseEther("1"), // sending 1 FTM
            })
            expect(mintTx).to.emit(musicNft, "Minted").withArgs(1, tokenUri)
            const receipt = await mintTx.wait()
            const event = receipt.events.find((e) => e.event === "Minted")
            const tokenId = event.args[1]
            const retrievedTokenUri = await musicNft.tokenURI(tokenId)
            expect(retrievedTokenUri).to.equal(tokenUri)
            const minter = await musicNft._minters(tokenId)
            expect(minter).to.equal(deployer.address)
        })
    })

    describe("burn function", () => {
        it("does not allow a non-approved address (ie minter if they are still owner) to burn the token", async function () {
            await musicNft.connect(deployer).mintToken("tokenURI", {
                value: ethers.utils.parseEther("1"), // sending 1 FTM
            })
            const currentTokenId = await musicNft.getCurrentTokenId()
            const tokenId = currentTokenId.sub(1) // Get the most recently minted token
            await expect(musicNft.connect(accounts[1]).burn(tokenId)).to.be.revertedWith(
                "MusicNft__CanOnlyBeBurnedIfOwnedByMinter"
            )
        })
        it("burns the token successfully, reducing owner's balance", async function () {
            // Mint a new token
            await musicNft.connect(deployer).mintToken("tokenURI", {
                value: ethers.utils.parseEther("1"), // sending 1 FTM
            })
            const initialOwnerBalance = await musicNft.balanceOf(deployer.address)
            const tokenIdToBurn = (await musicNft.getCurrentTokenId()).toNumber() - 1
            await musicNft.connect(deployer).burn(tokenIdToBurn)
            const finalOwnerBalance = await musicNft.balanceOf(deployer.address)
            expect(finalOwnerBalance).to.equal(initialOwnerBalance - 1)
        })
    })

    describe("withdraw function", () => {
        it("reverts if there is no balance to withdraw", async function () {
            await expect(musicNft.withdraw()).to.be.revertedWith("MusicNft__NothingToWithdraw")
        })
        it("transfers the contract's balance to the owner", async function () {
            await musicNft.connect(deployer).mintToken("tokenURI", {
                value: ethers.utils.parseEther("1"), // sending 1 FTM
            })
            const initialBalance = await ethers.provider.getBalance(deployer.address)
            await musicNft.connect(deployer).withdraw()
            const finalBalance = await ethers.provider.getBalance(deployer.address)
            expect(finalBalance).to.be.gt(initialBalance)
        })
    })
})
