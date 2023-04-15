// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

struct Group {
  uint256 id;
  string name;
  string h;
  string kpPub;
  string signature;
}

struct Proof {
  string v;
  string d;
  string c;
  string a;
  string zSig;
  string zv;
  string cc;
  string m;
  string zr;
}

interface IZkMoku {
  event RegiserGroup(address indexed member, uint120 value);

  /**
   * @dev Register Group
   */
  function regiserGroup(string calldata name, string calldata h, string calldata kpPub, string calldata signature) external;

  /**
   * @dev Get Registered Group
   */
  function getGroups() external view returns (Group[] memory);

  /**
   * @dev Get Group
   */
  function getGroup(uint256 id) external view returns (Group memory);


  /**
   * @dev Mint Proof
   */
  function mintProof(uint256 id, Proof calldata proof, address holder) external;

  function getTokenUrls(address holder) external view returns (uint256[] memory);
}