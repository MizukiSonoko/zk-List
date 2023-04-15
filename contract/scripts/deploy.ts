import { ethers } from "hardhat";

async function main() {
  const currentTimestampInSeconds = Math.round(Date.now() / 1000);

  const ZkMoku = await ethers.getContractFactory("ZkMoku");
  const name = "zkMoku";
  const symbol = "zkm"
  const zkMoku = await ZkMoku.deploy(name, symbol);

  await zkMoku.deployed();

  console.log(
    `zkMoku with (${name}, ${symbol}) deployed to ${zkMoku.address}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
