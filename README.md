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