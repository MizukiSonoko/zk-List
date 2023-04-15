// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import { IZkMoku, Group, Proof } from "./interface/IZkMoku.sol";
import { ERC721, IERC721 } from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import { Counters } from "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Base64.sol";


contract ZkMoku is
    IZkMoku,
    ERC721
{
    using Counters for Counters.Counter;
    using Strings for uint256;

    mapping (uint256 => Group) private groups;
    // TokenID => Proof / Group
    mapping (uint256 => Proof) internal tokenIdproofs;
    mapping (uint256 => uint256) private tokenIdgroupId;
    mapping(address => uint256[]) internal tokenIdByMember;

    uint256 private nextGroupId;
    Counters.Counter private tokenIdCounter;

    constructor(
        string memory name,
        string memory symbol
    ) ERC721(name, symbol) {
        nextGroupId = 0;
    }

    function getGroups() external view returns (Group[] memory) {
        Group[] memory groupList = new Group[](nextGroupId);

        for (uint256 i = 0; i < nextGroupId; i++) {
            groupList[i] = groups[i];
        }

        return groupList;
    }

    function getGroup(uint256 id) external view returns (Group memory) {
        require(nextGroupId != 0, "Group does not exist");
        require(id < nextGroupId, "Group does not exist associated with id");
        return groups[id];
    }

    function regiserGroup(string memory name, string memory h, string memory kpPub, string memory signature) external {
        Group storage newGroup = groups[nextGroupId];
        require(bytes(name).length != 0, "name must not be empty");
        require(bytes(h).length != 0, "h must not be empty");
        require(bytes(kpPub).length != 0, "kpPub must not be empty");
        require(bytes(signature).length != 0, "signature must not be empty");

        newGroup.id = nextGroupId;
        newGroup.name = name;  
        newGroup.h = h;
        newGroup.kpPub = kpPub;
        newGroup.signature = signature; 
        
        nextGroupId++;
    }

    function mintProof(uint256 groupId, Proof memory proof, address holder) external {
        tokenIdCounter.increment();

        for (uint256 i = 0; i < tokenIdByMember[holder].length; i++) {
            require(tokenIdgroupId[tokenIdByMember[holder][i]] != groupId, "already holder");
        }

        tokenIdproofs[tokenIdCounter.current()] = proof;
        tokenIdgroupId[tokenIdCounter.current()] = groupId;
        tokenIdByMember[holder].push(tokenIdCounter.current());

        _safeMint(holder, tokenIdCounter.current());
    }

     function getProofJSON(uint256 tokenId) public view returns (string memory) {
        require(_exists(tokenId), "ERC721Metadata: Metadata query for nonexistent token");
        Proof storage proof = tokenIdproofs[tokenId];
        Group storage group = groups[tokenIdgroupId[tokenId]];
        string memory json = string(abi.encodePacked(
            '{',
                '"h": "',     group.h, '",',
                '"kpPub": "', group.kpPub, '",',
                '"v": "', proof.v, '",',
                '"d": "', proof.d, '",',
                '"c": "', proof.c, '",',
                '"a": "', proof.a, '",',
                '"zSig": "', proof.zSig, '",',
                '"zv": "', proof.zv, '",',
                '"cc": "', proof.cc, '",',
                '"m": "', proof.m, '",',
                '"zr": "', proof.zr, '"',
            '}'
        ));

        return json;
    }

    function getMetadataJSON(uint256 tokenId) public view returns (string memory) {
        require(_exists(tokenId), "ERC721Metadata: Metadata query for nonexistent token");
        Group storage group = groups[tokenIdgroupId[tokenId]];
        string memory json = string(abi.encodePacked(
            '{',
                '"name": "', group.name,' #', tokenId.toString(), '",',
                '"description": "The proof of belonging to ', group.name, ' group.",',
                '"image": "https://placehold.jp/593e70/ffffff/500x500.png?text=', group.name, '",',
                '"proof":', getProofJSON(tokenId),
            '}'
        ));

        return json;
    }

    function tokenURI(uint256 tokenId) public view virtual override(ERC721) returns (string memory) {
        require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");
        string memory json = Base64.encode(bytes(getMetadataJSON(tokenId)));
        return string(
            abi.encodePacked(
                "data:application/json;base64,",
                json
            )
        );
    }


    function getTokenUrls(address holder) public view override returns (uint256[] memory) {
        return tokenIdByMember[holder];
    }
}
