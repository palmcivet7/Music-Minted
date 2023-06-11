# Music Minted: An application for minting music NFTs
This project contains a smart contract based application for **minting music NFTs**. The price to mint is $1 and ensured by using [Chainlink Pricefeeds](https://docs.chain.link/data-feeds/.

[Live demo on Fantom Testnet](https://testnet.ftmscan.com/address/0x95b948dba9cb230eb289080d4c2b4db0a5a7afa1#code).

## Table of Contents
- [Overview](#overview)
- [Installation](#installation)
- [Testing](#testing)
- [Application](#application)
- [Minting](#minting)
- [Extra](#extra)
- [License](#license)


## Overview
Music Minted is an application for musicians to mint their music into nfts. It costs $1 per mint, and uses Chainlink price feeds to ensure that. When files are submitted, the audio and cover art are uploaded to AWS S3, and are then included in a json file along with the other submitted info. This metadata json file gets passed to the nft contract as the token uri.

## Installation
To install the necessary dependencies, first ensure that you have [Node.js](https://nodejs.org/) and [Yarn](https://yarnpkg.com/) installed. Then, run the following command in the project's root directory:
```
yarn install
```
This project uses the [Hardhat](https://hardhat.org/) developer environment.

## Testing
To run the unit tests for the MusicNft contract, first make sure you have deployed the MockV3Aggregator contract with:
```
yarn hardhat deploy --tags mocks
```
Deploy the MusicNft contract first using the following command:
```
yarn hardhat deploy --tags MusicNft
```

Then execute the following command:
```
yarn hardhat test
```

## Application
To run the Music Minted application locally you will need to open two terminals from the project's root directory.
In one terminal input:
```
cd music-minted-backend
yarn install
node src/app.js
```
And in the other terminal input:
```
cd music-minted-frontend
yarn install
yarn dev
```

## Minting
Here is a step-by-step process of how the minting process is handled when a user uploads their audio and inputs the metadata into the frontend:

### Form Submission and File Upload:
The user fills out the upload form with their track information and selects their audio and image files for upload. When they submit the form, the audio file, the cover art (image file) and the form data are sent to the backend server.

The minter must certify that they own the rights to the audio.

### File Validation:
The files are validated upon upload to make sure that they are audio and image files.

### File Storage:
The backend server receives the file and the form data. It uploads the audio and image files to an AWS S3 bucket, a service for storing files. AWS S3 will provide separate URLs for accessing the files.

### Metadata Storage:
The backend then constructs a JSON object containing the metadata from the form, and the AWS S3 URLs for the audio file and cover art. It can then store this metadata in a JSON file, which is also uploaded to AWS S3. AWS will provide a URL for accessing the metadata file.

### Minting the NFT:
After the metadata JSON file is uploaded to AWS S3, the URL is returned, the minting function in the smart contract is called. The AWS URL for the metadata JSON file is passed in as the _tokenURI parameter when minting the NFT. The smart contract will mint the new NFT and associate it with the provided token URI.

### Token URI Access:
Now, anyone who wants to access the metadata for the NFT can call the tokenURI function in the smart contract with the token ID. This function will return the AWS URL for the metadata JSON file. The user can then fetch the metadata file from AWS to view the details about the track, including the uploaded audio file and cover art.

## Extra:
Future Features may include:
- unlockable content (concert tickets, future release priority, etc)
- collaborations, i.e. multisig minters
- playlists (NFT holders can curate playlists from their holdings)
- evolving artwork (dNFT cover art based on amount of listens, time, upcoming releases/events, etc)


## License
This project is licensed under the [MIT License](https://opensource.org/license/mit/).

