import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with:", deployer.address);

  // Get the contract factory
  const Factory = await ethers.getContractFactory("UniswapV2Factory");

  // Deploy with feeToSetter as deployer
  const factory = await Factory.deploy(deployer.address);

  await factory.waitForDeployment();
  console.log("UniswapV2Factory deployed to:", await factory.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
