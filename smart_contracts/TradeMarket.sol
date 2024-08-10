// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.2 <0.9.0;

import "./Trade.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./interface/ITrade.sol";
import "./interface/IWorldCoinVerifier.sol";
import "./Escrow.sol";
import "./interface/IEscrow.sol";

contract TradeMarket {
    struct TradeData {
        address lockedErc20Address;
        address demandedErc20Address;
        address smartContract;
        address seller;
        bool isOpen;
    }

    struct EscrowData {
        address lockedErc20Address;
        uint256 demandedAmount;
        string iban;
        address smartContract;
        address seller;
        bool isOpen;
    }

    struct EscrowDataResponse {
        address lockedErc20Address;
        string lockedErc20Symbol;
        uint256 lockedAmount;
        uint256 demandedAmount;
        address smartContract;
        address seller;
        string iban;
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
    EscrowData[] escrows;
    address worldCoinVerifier;
    address aiComputation;

    constructor(address _aiComputation) {
        aiComputation = _aiComputation;
    }

    function createTrade(
        address lockedErc20Address,
        address demandedErc20Address,
        uint256 demandedAmount
    ) external {
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

    function createEscrow(
        address lockedErc20Address,
        uint256 demandedAmount,
        string calldata iban
    ) external {
        address smartContractAddress = address(
            new Escrow(
                msg.sender,
                lockedErc20Address,
                iban,
                demandedAmount,
                aiComputation
            )
        );
        escrows.push(
            EscrowData(
                lockedErc20Address,
                demandedAmount,
                iban,
                smartContractAddress,
                msg.sender,
                true
            )
        );
    }

    function getEscrows() external view returns (EscrowDataResponse[] memory) {
        uint256 escrowCount = escrows.length;
        EscrowDataResponse[] memory _escrows = new EscrowDataResponse[](
            escrowCount
        );
        for (uint32 i = 0; i < escrowCount; i++) {
            _escrows[i] = EscrowDataResponse(
                escrows[i].lockedErc20Address,
                ERC20(escrows[i].lockedErc20Address).symbol(),
                ERC20(escrows[i].lockedErc20Address).balanceOf(
                    escrows[i].smartContract
                ),
                IEscrow(escrows[i].smartContract).getDemandedAmount(),
                escrows[i].smartContract,
                escrows[i].seller,
                escrows[i].iban,
                escrows[i].isOpen
            );
        }
        return _escrows;
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
