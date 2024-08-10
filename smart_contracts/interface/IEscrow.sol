// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.2 <0.9.0;

interface IEscrow {
    function getDemandedAmount() external view returns(uint256);
    function lockManual() external;
    function lock(uint256 amount) external returns(uint256);
    function unlock(address newOwner) external;
}