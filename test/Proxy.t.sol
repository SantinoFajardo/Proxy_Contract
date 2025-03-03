// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import "../src/Proxy.sol";

contract ProxyTest is Test {
    Proxy proxy;
    address implementation;
    address newImplementation;
    address owner;
    address nonOwner;

    function setUp() public {
        owner = address(this);
        nonOwner = address(0x123);
        implementation = address(0x456);
        newImplementation = address(0x789);
        proxy = new Proxy(implementation);
    }

    function testInitialImplementation() public {
        assertEq(proxy.implementation(), implementation, "Initial implementation should be set correctly");
    }

    function testChangeImplementation() public {
        proxy.changeImplementation(newImplementation);
        assertEq(proxy.implementation(), newImplementation, "Implementation should be updated");
    }

    function testChangeImplementationByNonOwner() public {
        vm.prank(nonOwner);
        vm.expectRevert("Only the owner can change the implementation");
        proxy.changeImplementation(newImplementation);
    }

    function testFallback() public {
        // This test would require a mock implementation contract to test the fallback
        // You can deploy a mock contract and test the delegatecall behavior
    }

    function testReceive() public {
        // Test the receive function by sending ether to the contract
        payable(address(proxy)).transfer(1 ether);
        assertEq(address(proxy).balance, 1 ether, "Proxy should have received 1 ether");
    }
} 