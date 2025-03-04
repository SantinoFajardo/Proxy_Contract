// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Proxy {
    address public implementation;
    address public owner;

    constructor(address _implementation){
        implementation = _implementation;
        owner = msg.sender;
    }

    function changeImplementation(address _newImplementation) public {
        require(msg.sender == owner, "Only the owner can change the implementation");
        implementation = _newImplementation;
    }

    fallback() external payable {
        address impl = implementation;
        assembly {
            // Get the free memory pointer
            let ptr := mload(0x40)
            // Copy the calldata to memory
            calldatacopy(ptr, 0, calldatasize())
            // Delegatecall to the implementation contract
            let result := delegatecall(gas(), impl, ptr, calldatasize(), 0, 0)
            // Copy the return data to memory
            returndatacopy(0, 0, returndatasize())
            // If the delegatecall failed, revert
            switch result
            case 0 { revert(0, returndatasize()) }
            default { return (0, returndatasize()) }
        }
    }

    receive() external payable {}
}