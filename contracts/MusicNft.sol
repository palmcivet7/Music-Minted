pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MusicNFT is ERC721, Ownable {
    uint256 public constant MINT_PRICE_FTM = 1 * 10 ** 18; // 1 FTM

    // Mapping from token ID to creator address
    mapping(uint256 => address) private _creators;

    // Mapping from creator address to royalty percentage
    mapping(address => uint256) private _royalties;

    constructor() ERC721("MusicNFT", "MNFT") {}

    function mintToken(address _to, string memory _tokenURI) public payable {
        require(msg.value >= mintingCost, "Not enough FTM sent for minting");
        uint256 newTokenId = _tokenIdTracker.current();
        _mint(_to, newTokenId);
        _setTokenURI(newTokenId, _tokenURI);
        minter[newTokenId] = msg.sender;
        _tokenIdTracker.increment();
    }

    function burn(uint256 tokenId) public {
        require(_isApprovedOrOwner(_msgSender(), tokenId), "Caller is not owner nor approved");
        require(_creators[tokenId] == msg.sender, "Only the original minter can burn the token");

        _burn(tokenId);
    }

    function royaltyInfo(
        uint256 _tokenId,
        uint256 _salePrice
    ) external view returns (address receiver, uint256 royaltyAmount) {
        address creator = _creators[_tokenId];
        uint256 royalty = _royalties[creator];
        return (creator, (_salePrice * royalty) / 100);
    }

    function withdraw() public onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "Nothing to withdraw");
        payable(msg.sender).transfer(balance);
    }
}
