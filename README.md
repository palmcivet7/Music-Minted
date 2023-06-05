# Music NFT Minting Platform for Fantom FTM

Music NFT 
    - mint only with audio uploaded to AWS
    - burnable only by minter if minter is owner
    - costs 1 FTM to mint
    - 10% royalties to minter
    - minter can customize amount of NFTs per mint

Metadata stored as JSON using AWS.

{
    "name": "Track Title",
    "image": "https://aws-s3-link-to-artwork.jpg",
    "attributes": [
        {
            "trait_type": "Artist",
            "value": "Artist Name"
        },
        {
            "trait_type": "Genre",
            "value": "Electronic"
        },
        {
            "trait_type": "Release Year",
            "value": "2023"
        },
        {
            "trait_type": "Audio",
            "value": "https://aws-s3-link-to-audio-file.mp3"
        }
    ]
}

Minter must certify they own the rights to the audio.

Additional future features:
    - unlockable content (concert tickets, future release priority, etc)
    - collaborations, i.e. multisig minters
    - playlists (NFT holders can curate playlists from their holdings)
    - evolving artwork (dNFT cover art based on amount of listens, time, upcoming releases/events, etc)

## Upload/Mint Steps

When a user uploads their audio and inputs the metadata into your front-end form, here's a step-by-step process of how you might handle it:

### Form Submission and File Upload:
The user fills out your form with the track information and selects their audio file for upload. When they submit the form, the audio file and the form data are sent to your backend server.

### File Validation:
After the file is uploaded, your back-end server validates that the file is indeed an audio file. Check the extension of the uploaded file and ensure it's a common audio file format like .mp3, .wav, .aac, etc.

### File Storage:
Your backend server receives the file and the form data. It uploads the audio file to an AWS S3 bucket, a service for storing files. AWS S3 will provide a URL for accessing the file.

### Metadata Storage:
The backend then constructs a JSON object containing the metadata from the form, including the AWS S3 URL for the audio file. It can then store this metadata in a JSON file, which is also uploaded to AWS S3. AWS will provide a URL for accessing the metadata file.

### Minting the NFT:
After the metadata JSON file is uploaded to AWS S3 and you have the URL, you can then call the minting function in your smart contract. Pass in the AWS URL for the metadata JSON file as the _tokenURI parameter when minting the NFT. The smart contract will mint the new NFT and associate it with the provided token URI.

### Token URI Access:
Now, anyone who wants to access the metadata for the NFT can call the tokenURI function in the smart contract with the token ID. This function will return the AWS URL for the metadata JSON file. The user can then fetch the metadata file from AWS to view the details about the track.

