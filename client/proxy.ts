import { ethers } from "ethers";
import dotenv from "dotenv";

dotenv.config();

const proxy_abi = [
  "function setNumber(uint256 _number) public",
  "function getNumber() public view returns (uint256)",
  "function implementation() view returns (address)",
  "function changeImplementation(address _newImplementation)",
];

const implementation_abi = [
  "function getNumber() public view returns (uint256)",
  "function setNumber(uint256 _number) public",
  "function withdraw() public",
  "function deposit() public payable",
  "function getBalance() public view returns (uint256)",
];

const pk = process.env.PRIVATE_KEY as string;
const proxyAddress = process.env.PROXY_ADDRESS as string;
const implementationAddress = process.env.IMPLEMENTATION_ADDRESS as string;

class Proxy {
  private proxyContract: ethers.Contract;
  private implementationContract: ethers.Contract;

  constructor(
    private readonly proxyAddress: string,
    private readonly wallet: ethers.Wallet,
    private readonly provider: ethers.JsonRpcProvider
  ) {
    this.proxyContract = new ethers.Contract(
      this.proxyAddress,
      proxy_abi,
      this.wallet
    );
    this.implementationContract = new ethers.Contract(
      implementationAddress,
      implementation_abi,
      this.wallet
    );
  }

  async getNumber() {
    const encodedData =
      this.implementationContract.interface.encodeFunctionData("getNumber");
    console.log("encodedData", encodedData);
    const tx = await this.wallet.sendTransaction({
      to: this.proxyAddress,
      data: encodedData,
      gasLimit: BigInt(210000),
      gasPrice: (await this.provider.getFeeData()).gasPrice,
    });
    return await tx.wait();
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

  const proxy = new Proxy(proxyAddress, wallet, provider);

  await proxy.changeImplementation(implementationAddress);

  const currentImpl = await proxy.getImplementation();
  console.log("Current implementation:", currentImpl);

  await proxy.setNumber(10);

  const number = await proxy.getNumber();
  console.log("Número:", number);
}

main().catch(console.error);
