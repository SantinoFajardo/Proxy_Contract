// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import "src/Implementation.sol";

contract ImplementationTest is Test {
    Implementation implementation;

    function setUp() public {
        implementation = new Implementation();
    }

    function testSetAndGetNumber() public {
        implementation.setNumber(42);
        uint256 number = implementation.getNumber();
        assertEq(number, 42);
    }

    function testDepositAndGetBalance() public {
        // Debugging: Check initial balance
        console.log("Initial balance:", implementation.getBalance());

        // Deposit 1 ether
        payable(address(implementation)).transfer(1 ether);

        // Debugging: Check balance after deposit
        uint256 balance = implementation.getBalance();
        console.log("Balance after deposit:", balance);

        assertEq(balance, 1 ether);
    }

    function testWithdraw() public {
        payable(address(implementation)).transfer(1 ether);
        implementation.withdraw();
        uint256 balance = implementation.getBalance();
        assertEq(balance, 0);
    }

    receive() external payable {}
} 