# Proxy Contracts

## Introduction

Proxy contracts are a design pattern in Ethereum smart contract development that allows for the separation of contract logic and data storage. This pattern is particularly useful for upgrading contracts without changing their address, which is crucial for maintaining the continuity of contract interactions and data.

## Why Use Proxy Contracts?

1. **Upgradeability**: One of the primary reasons for using proxy contracts is to enable contract upgradeability. Smart contracts on Ethereum are immutable once deployed, meaning their code cannot be changed. By using a proxy, you can point to a new implementation contract without changing the proxy's address.

2. **Separation of Concerns**: Proxy contracts separate the logic (implementation) from the data (storage). This separation allows developers to update the logic without affecting the stored data.

3. **Gas Efficiency**: By reusing the same proxy contract for different implementations, you can save on deployment costs.

## How Proxy Contracts Work

A proxy contract typically consists of two main components:

1. **Proxy Contract**: This contract holds the address of the implementation contract and delegates calls to it. It uses the `delegatecall` opcode to execute functions in the context of the proxy's storage.

2. **Implementation Contract**: This contract contains the actual logic and functions that the proxy will execute. It can be upgraded by deploying a new implementation contract and updating the proxy to point to it.

<img src="https://miro.medium.com/v2/resize:fit:1400/0*IiGw-py2-Uebqmhj"/>

### Key Concepts

- **Delegatecall**: This is an Ethereum opcode that allows a contract to execute code from another contract while maintaining its own storage context. This is crucial for proxy contracts as it allows the proxy to use the implementation's logic while keeping its own state.

- **Storage Layout**: When using proxy contracts, it's important to maintain a consistent storage layout between different implementations to avoid data corruption.

## Example

Here's a simple example of how a proxy contract might be structured:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Proxy {
    address public implementation;

    constructor(address _implementation) {
        implementation = _implementation;
    }

    function changeImplementation(address _newImplementation) public {
        // Add access control here
        implementation = _newImplementation;
    }

    fallback() external payable {
        address impl = implementation;
        require(impl != address(0), "Implementation not set");

        assembly {
            let ptr := mload(0x40)
            calldatacopy(ptr, 0, calldatasize())
            let result := delegatecall(gas(), impl, ptr, calldatasize(), 0, 0)
            let size := returndatasize()
            returndatacopy(ptr, 0, size)

            switch result
            case 0 { revert(ptr, size) }
            default { return(ptr, size) }
        }
    }
}
```

## Considerations

- **Security**: Ensure that only authorized entities can change the implementation address to prevent malicious upgrades.
- **Testing**: Thoroughly test proxy contracts to ensure that the delegatecall behavior works as expected and that storage layouts are compatible across upgrades.

## Conclusion

Proxy contracts are a powerful tool for creating upgradeable and flexible smart contracts on Ethereum. By understanding and implementing this pattern, developers can create more robust and maintainable decentralized applications.
