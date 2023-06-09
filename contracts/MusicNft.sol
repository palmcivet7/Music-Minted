// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

error MusicNft__InvalidTokenUri();
error MusicNft__NeedMoreFTMSent();
error MusicNft__CanOnlyBeBurnedIfOwnedByMinter();
error MusicNft__NothingToWithdraw();

contract MusicNft is ERC721, ERC721URIStorage, ERC721Burnable, Ownable {
    event Minted(address indexed _to, uint256 indexed _tokenId, string _tokenURI);

    using Counters for Counters.Counter;

    uint256 public constant MINT_PRICE_FTM = 1 * 10 ** 18; // 1 FTM
    Counters.Counter public _tokenIdTracker;

    // Mapping from token ID to minter address
    mapping(uint256 => address) public _minters;

    constructor() ERC721("Music Minted", "MM") {}

    function mintToken(string memory _tokenURI) public payable {
        if (bytes(_tokenURI).length == 0) {
            revert MusicNft__InvalidTokenUri();
        }
        if (msg.value < MINT_PRICE_FTM) {
            revert MusicNft__NeedMoreFTMSent();
        }
        uint256 newTokenId = _tokenIdTracker.current();
        _tokenIdTracker.increment();
        _mint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, _tokenURI);
        _minters[newTokenId] = msg.sender;
        emit Minted(msg.sender, newTokenId, _tokenURI);
    }

    function burn(uint256 tokenId) public override {
        if (!_isApprovedOrOwner(_msgSender(), tokenId) && _minters[tokenId] != msg.sender) {
            revert MusicNft__CanOnlyBeBurnedIfOwnedByMinter();
        }
        _burn(tokenId);
    }

    function withdraw() public onlyOwner {
        uint256 balance = address(this).balance;
        if (balance <= 0) {
            revert MusicNft__NothingToWithdraw();
        }
        payable(msg.sender).transfer(balance);
    }

    function _setTokenURI(
        uint256 tokenId,
        string memory _tokenURI
    ) internal override(ERC721URIStorage) {
        super._setTokenURI(tokenId, _tokenURI);
    }

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
        delete _minters[tokenId];
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    function tokenURI(
        uint256 tokenId
    ) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function getCurrentTokenId() public view returns (uint256) {
        return _tokenIdTracker.current();
    }

    // function minterOf(uint256 tokenId) public view returns (address) {
    //     return _minters[tokenId];
    // }
}
