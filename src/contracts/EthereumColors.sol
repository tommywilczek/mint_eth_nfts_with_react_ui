// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "base64-sol/base64.sol";

contract EthereumColors is ERC721URIStorage {

    string[] public colors;

    mapping(string => bool) _colorExists;
    mapping(string => uint) colorToTokenId;

    event CreatedColor(uint256 indexed tokenId, string tokenUri);

    modifier onlyHexColor(bytes memory _color) {
        require(_color.length == 7, "Length not correct");
        require(_color[0] == "#", "Color code does not begin with '#'");
        for (uint8 i = 1; i < 7; i++) {
            require(
                _color[i] == 0x30 || // 0
                _color[i] == 0x31 || // 1
                _color[i] == 0x32 || // 2
                _color[i] == 0x33 || // 3
                _color[i] == 0x34 || // 4
                _color[i] == 0x35 || // 5
                _color[i] == 0x36 || // 6
                _color[i] == 0x37 || // 7
                _color[i] == 0x38 || // 8
                _color[i] == 0x39 || // 9
                _color[i] == 0x41 || // A
                _color[i] == 0x42 || // B
                _color[i] == 0x43 || // C
                _color[i] == 0x44 || // D
                _color[i] == 0x45 || // E
                _color[i] == 0x46,   // F
                "Color code is not a hex value"
            );
        }
        _;
    }
    
    constructor() ERC721("EthereumColors", "COLORS") {
    }

    // Make this bytes32 or smaller??
    function mint(string  memory _color) external onlyHexColor(bytes(_color)) {
        require(!_colorExists[_color], 'Color exists');
        uint _id = colors.length;
        _safeMint(msg.sender, _id);
        colors.push(_color);
        _colorExists[_color] = true; // maybe remove and use tokenIdToColor?
        colorToTokenId[_color] = _id;
        string memory tokenUri = getTokenUriForColor(_color);
        _setTokenURI(_id, tokenUri);
        emit CreatedColor(_id, tokenUri);
    }

    function totalSupply() public view returns (uint) {
        return colors.length;
    }

    // Probably don't need this
    function getTokenIdForColor(string memory _color) public view returns (uint) {
        uint tokenId = colorToTokenId[_color];
        return tokenId;
    }

    function getMetadataForColor(string memory _color) public view returns (string memory) {
        uint tokenId = colorToTokenId[_color];
        string memory metadata = tokenURI(tokenId);
        return metadata;
    }

    function getTokenUriForColor(string memory _color) public pure returns (string memory) {
        string memory _imageUri = colorToImageUri(_color);
        string memory tokenUri = formatTokenUri(_color, _imageUri);
        return tokenUri;
    }

    function colorToImageUri(string memory _color) public pure returns (string memory) {
        // <svg width='100%' height='100%' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' fill='lime' /></svg>
        // data:image/svg+xml;base64,<Base64-encoding)
        string memory baseUrl = "data:image/svg+xml;base64,";
        string memory baseSvg = "<svg width='100%' height='100%' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' fill='";
        string memory svg =  string(abi.encodePacked(baseSvg, _color, "' /></svg>"));
        string memory svgBase64Encoded = Base64.encode(bytes(string(abi.encodePacked(svg))));
        string memory imageUri = string(abi.encodePacked(baseUrl, svgBase64Encoded));
        return imageUri;
    }

    // EXTERNAL URL IS INVALID... CHANGE
    function formatTokenUri(string memory _color, string memory _imageUri) public pure returns (string memory) {
        string memory baseUri = "data:application/json;base64,";
        string memory json = string(abi.encodePacked(
            '{',
                '"name": "', _color, 
                '", "description": "Proof of ownership of the original color ',
                _color, ' minted on the Ethereum blockchain.',
                '", "image": "', _imageUri, '"',
            '}'
        ));
        string memory encodedJson = Base64.encode(bytes(json));
        string memory tokenUri = string(abi.encodePacked(baseUri, encodedJson));
        return tokenUri;
    }
}