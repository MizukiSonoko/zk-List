// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

struct Signature {
  int64 id;
  string signature;
}

struct Group {
  string h;
  string kpPub;
  Signature[] signatures;
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
  function regiserGroup(string calldata h, string calldata kpPub, Signature[] calldata signatures) external;

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
 
}