// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.2 <0.9.0;
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./interface/ITrade.sol";

contract Escrow is Ownable {
    address lockedErc20;
    string iban;
    uint256 demandedAmount;
    uint256 lockedAmount;
    address aiComputation;

    constructor(
        address seller,
        address _lockedErc20,
        string memory _iban,
        uint256 _demandedAmount,
        address _aiComputation
    ) Ownable(seller) {
        lockedErc20 = _lockedErc20;
        iban = _iban;
        demandedAmount = _demandedAmount;
        lockedAmount = 0;
        aiComputation = _aiComputation;
    }

    modifier only_ai_computation(){
        require(msg.sender == aiComputation,"Only ai can call this function");
        _;
    }

    function getDemandedAmount() external view returns (uint256) {
        return demandedAmount;
    }

    function lockManual() external {
        lockedAmount = ERC20(lockedErc20).balanceOf(address(this));
    }

    function lock(uint256 amount) external returns (uint256) {
        require(
            amount == ERC20(lockedErc20).allowance(msg.sender, address(this)),
            "Please allow for the payment first"
        );
        ERC20(lockedErc20).transferFrom(msg.sender, address(this), amount);
        lockedAmount = ERC20(lockedErc20).balanceOf(address(this));
        return lockedAmount;
    }

    function unlock(address newOwner) external only_ai_computation {
        ERC20(lockedErc20).transfer(newOwner, demandedAmount);
    }
}
