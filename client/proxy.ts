import { ethers } from "ethers";

const proxy_abi = [
  "function setNumber(uint256 _number) public",
  "function getNumber() public view returns (uint256)",
  "function implementation() view returns (address)",
  "function changeImplementation(address _newImplementation)",
];

const pk = process.env.PRIVATE_KEY as string;
const proxyAddress = process.env.PROXY_ADDRESS as string;
const implementationAddress = process.env.IMPLEMENTATION_ADDRESS as string;

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
  const provider = new ethers.JsonRpcProvider(process.env.RPC_URL as string);
  const wallet = new ethers.Wallet(pk, provider);

  const proxy = new Proxy(proxyAddress, wallet);

  await proxy.changeImplementation(implementationAddress);

  const currentImpl = await proxy.getImplementation();
  console.log("Current implementation:", currentImpl);

  await proxy.setNumber(10);

  const number = await proxy.getNumber();
  console.log("Número:", number);
}

main().catch(console.error);
