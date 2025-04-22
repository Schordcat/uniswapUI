import { ethers } from "ethers";
import erc20Abi from "../../abi/ERC20.json";

export async function approveToken(
  tokenAddress: string,
  spender: string,
  amount: string,
  signer: ethers.Signer
) {
  const token = new ethers.Contract(tokenAddress, erc20Abi, signer);
  const allowance = await token.allowance(await signer.getAddress(), spender);

  if (allowance.gte(amount)) {
    console.log("✅ Already approved");
    return;
  }

  const tx = await token.approve(spender, amount);
  await tx.wait();
  console.log("✅ Token approved");
}