// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import { IZkMoku, Group, Proof, Signature } from "./interface/IZkMoku.sol";
import { ERC721, IERC721 } from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import { Counters } from "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";


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

    function regiserGroup(string memory h, string memory kpPub, Signature[] memory signatures) external {
        Group storage newGroup = groups[nextGroupId];
        require(bytes(h).length != 0, "h must not be empty");
        require(bytes(kpPub).length != 0, "kpPub must not be empty");
        require(signatures.length != 0, "signatures must not be empty");

        newGroup.h = h;
        newGroup.kpPub = kpPub;
        for (uint256 i = 0; i < signatures.length; i++) {
            newGroup.signatures.push(signatures[i]);
        }
        nextGroupId++;
    }

    function mintProof(uint256 groupId, Proof memory proof, address holder) external {
        tokenIdCounter.increment();

        tokenIdproofs[tokenIdCounter.current()] = proof;
        tokenIdgroupId[tokenIdCounter.current()] = groupId;

        _safeMint(holder, tokenIdCounter.current());
    }

    function getMetadataJSON(uint256 tokenId) public view returns (string memory) {
        require(_exists(tokenId), "ERC721Metadata: Metadata query for nonexistent token");

        Proof storage proof = tokenIdproofs[tokenId];

        // JSON 形式のメタデータを動的に構築します。
        string memory json = string(abi.encodePacked(
            '{',
                '"tokenId": "', tokenId.toString(), '",',
                '"proof": {',
                    '"v": "', proof.v, '",',
                    '"d": "', proof.d, '",',
                    '"c": "', proof.c, '",',
                    '"a": "', proof.a, '",',
                    '"zSig": "', proof.zSig, '",',
                    '"zv": "', proof.zv, '",',
                    '"cc": "', proof.cc, '",',
                    '"m": "', proof.m, '",',
                    '"zr": "', proof.zr, '"',
                '}',
            '}'
        ));

        return json;
    }

    function tokenURI(uint256 tokenId) public view virtual override(ERC721) returns (string memory) {
        require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");
        return string(
            abi.encodePacked(
                "data:application/json;base64,",
                getMetadataJSON(tokenId)
            )
        );
    }

}
