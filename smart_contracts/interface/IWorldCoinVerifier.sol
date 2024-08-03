// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.2 <0.9.0;

interface IWorldCoinVerifier {
    function isUserVerified(address user) view external returns(bool);
    function isUserVerified(uint256 nullifierHash) view external returns(bool);
    function verifyAndExecute(
        address signal,
        uint256 root,
        uint256 nullifierHash,
        bytes calldata proof
    ) external ;
}
