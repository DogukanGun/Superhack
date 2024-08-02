// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Erc20T2 is ERC20, ERC20Permit {
    constructor()
        ERC20("MyToken2", "MTK2")
        ERC20Permit("MyToken2")
        
    {
        _mint(msg.sender, 10000000);
    }
}