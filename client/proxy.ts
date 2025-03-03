// impl_address = 0x5FbDB2315678afecb367f032d93F642f64180aa3
// new_impl_address = 0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9
// proxy_address = 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512

import { ethers } from "ethers";

const proxy_abi = [
  "function setNumber(uint256 _number) public",
  "function getNumber() public view returns (uint256)",
  "function implementation() view returns (address)",
  "function changeImplementation(address _newImplementation)",
];

const pk = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";

class Proxy {
  private proxyContract: ethers.Contract;

  constructor(
    private readonly proxyAddress: string,
    private readonly wallet: ethers.Wallet
  ) {
    this.proxyContract = new ethers.Contract(
      this.proxyAddress,
      proxy_abi,
      this.wallet
    );
  }

  async getNumber() {
    const number = await this.proxyContract.getNumber();
    return number;
  }

  async setNumber(newNumber: number) {
    const tx = await this.proxyContract.setNumber(newNumber);
    return await tx.wait();
  }

  async changeImplementation(newImplementation: string) {
    const tx = await this.proxyContract.changeImplementation(newImplementation);
    return await tx.wait();
  }

  async getImplementation() {
    const implementation = await this.proxyContract.implementation();
    return implementation;
  }
}

async function main() {
  const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
  const wallet = new ethers.Wallet(pk, provider);

  const proxy = new Proxy("0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512", wallet);

  await proxy.changeImplementation(
    "0x5FbDB2315678afecb367f032d93F642f64180aa3"
  );

  const currentImpl = await proxy.getImplementation();
  console.log("Current implementation:", currentImpl);

  await proxy.setNumber(10);

  const number = await proxy.getNumber();
  console.log("Número:", number);
}

main().catch(console.error);
