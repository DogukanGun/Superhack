// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.2 <0.9.0;

import "trade/Trade.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "trade/interface/ITrade.sol";
import "trade/interface/IWorldCoinVerifier.sol";

contract TradeMarket {
    struct TradeData {
        address lockedErc20Address;
        address demandedErc20Address;
        address smartContract;
        address seller;
        bool isOpen;
    }

    struct TradeDataResponse {
        address lockedErc20Address;
        string lockedErc20Symbol;
        uint256 lockedAmount;
        address demandedErc20Address;
        string demandedErc20Symbol;
        uint256 demandedAmount;
        address smartContract;
        address seller;
        bool isOpen;
    }

    TradeData[] trades;
    address worldCoinVerifier;


    constructor(address _worldCoinVerifier){
        worldCoinVerifier = _worldCoinVerifier;
    }

    modifier only_verified_users(uint256 nulifier) {
        require(IWorldCoinVerifier(worldCoinVerifier).isUserVerified(nulifier),"You are not verified");
        _;
    }

    function createTrade(
        address lockedErc20Address,
        address demandedErc20Address,
        uint256 demandedAmount,
        uint256 nulifier
    ) external only_verified_users(nulifier){
        address smartContractAddress = address(
            new Trade(
                msg.sender,
                lockedErc20Address,
                demandedErc20Address,
                demandedAmount
            )
        );
        trades.push(
            TradeData(
                lockedErc20Address,
                demandedErc20Address,
                smartContractAddress,
                msg.sender,
                true
            )
        );
    }

    function createEscrow() external {
        //TODO do with ai
    }

    function getTrades() external view returns (TradeDataResponse[] memory) {
        uint256 tradeCount = trades.length;
        TradeDataResponse[] memory _trades = new TradeDataResponse[](
            tradeCount
        );
        for (uint32 i = 0; i < tradeCount; i++) {
            _trades[i] = TradeDataResponse(
                trades[i].lockedErc20Address,
                ERC20(trades[i].lockedErc20Address).symbol(),
                ERC20(trades[i].lockedErc20Address).balanceOf(
                    trades[i].smartContract
                ),
                trades[i].demandedErc20Address,
                ERC20(trades[i].demandedErc20Address).symbol(),
                ITrade(trades[i].smartContract).getDemandedAmount(),
                trades[i].smartContract,
                trades[i].seller,
                trades[i].isOpen
            );
        }
        return _trades;
    }
}
