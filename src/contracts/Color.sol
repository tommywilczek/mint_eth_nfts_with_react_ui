// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Enumerable.sol";

contract Color is ERC721, IERC721Enumerable  {

    string[] public colors;

    mapping(string => bool) _colorExists;
    
    constructor() ERC721("Color", "COLOR") {
    }

    // IN REAL LIFE MAKE THIS ONLY OWNER, NOT PUBLIC!
    function mint(string  memory _color) public {
        require(!_colorExists[_color]);
        colors.push(_color);
        uint _id = colors.length;
        _safeMint(msg.sender, _id);
        _colorExists[_color] = true;
    }

    function totalSupply() external view override returns (uint256) {
        return colors.length;
    }

    function tokenOfOwnerByIndex(address owner, uint256 index) external view override returns (uint256 ) {}

    function tokenByIndex(uint256 index) external view override returns (uint256 ) {}
}