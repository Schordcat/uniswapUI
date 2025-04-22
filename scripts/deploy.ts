import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with:", deployer.address);

  // Replace this with the factory address you got from deployFactory.ts
  const factoryAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

  // Replace these with actual deployed token addresses
  const tokenA = "0x0000000000000000000000000000000000000001";
  const tokenB = "0x0000000000000000000000000000000000000002";

  const factory = await ethers.getContractAt("UniswapV2Factory", factoryAddress);

  const tx = await factory.createPair(tokenA, tokenB);
  await tx.wait();

  const pairAddress = await factory.getPair(tokenA, tokenB);
  console.log("✅ Pair deployed to:", pairAddress);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
