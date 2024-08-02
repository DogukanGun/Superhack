// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.2 <0.9.0;
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "trade/interface/ITrade.sol";

contract Trade is Ownable, ITrade {
    address lockedErc20;
    address demandedErc20;
    uint256 demandedAmount;
    uint256 lockedAmount;

    constructor(
        address seller,
        address _lockedErc20,
        address _demandedErc20,
        uint256 _demandedAmount
    ) Ownable(seller) {
        lockedErc20 = _lockedErc20;
        demandedErc20 = _demandedErc20;
        demandedAmount = _demandedAmount;
        lockedAmount = 0;
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

    function unlock() external {
        require(
            demandedAmount ==
                ERC20(demandedErc20).allowance(msg.sender, address(this)),
            "Please allow for the payment first"
        );
        require(lockedAmount != 0, "Please wait owner to lock the contract");
        ERC20(demandedErc20).transferFrom(msg.sender, owner(), demandedAmount);
        ERC20(lockedErc20).transfer(msg.sender, demandedAmount);
    }
}
