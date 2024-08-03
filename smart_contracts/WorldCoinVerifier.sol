// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.2 <0.9.0;

import "trade/interface/IWorldCoinVerifier.sol";

interface IWorldID {
    /// @notice Reverts if the zero-knowledge proof is invalid.
    /// @param root The of the Merkle tree
    /// @param groupId The id of the Semaphore group
    /// @param signalHash A keccak256 hash of the Semaphore signal
    /// @param nullifierHash The nullifier hash
    /// @param externalNullifierHash A keccak256 hash of the external nullifier
    /// @param proof The zero-knowledge proof
    /// @dev  Note that a double-signaling check is not included here, and should be carried by the caller.
    function verifyProof(
        uint256 root,
        uint256 groupId,
        uint256 signalHash,
        uint256 nullifierHash,
        uint256 externalNullifierHash,
        uint256[8] calldata proof
    ) external view;
}


contract WorldCoinVerifier is IWorldCoinVerifier {
    error InvalidNullifier();

    event MessageSent(string message);

    IWorldID internal immutable worldId;

    /// @dev The keccak256 hash of the externalNullifier (unique identifier of the action performed), combination of appId and action
    uint256 internal immutable externalNullifierHash;

    /// @dev The World ID group ID (1 for Orb-verified)
    uint256 internal immutable groupId = 1;

    /// @dev Whether a nullifier hash has been used already. Used to guarantee an action is only performed once by a single person
    mapping(uint256 => bool) internal nullifierHashes;
    mapping(address => bool) internal verifiedUsers;

    constructor(
        IWorldID _worldId,
        string memory _appId,
        string memory _action
    ) {
        worldId = _worldId;
        uint256 encodePacket = uint256(keccak256(abi.encodePacked(_appId))) >>
            8;
        externalNullifierHash =
            uint256(keccak256(abi.encodePacked(encodePacket, _action))) >>
            8;
    }

    fallback() external payable {}

    receive() external payable {}

    function addressToBytes32(address _addr) internal pure returns (bytes32) {
        return bytes32(uint256(uint160(_addr)));
    }

    function decodeData(bytes calldata encodedData)
        public
        pure
        returns (uint256[8] memory)
    {
        uint256[8] memory decoded = abi.decode(encodedData, (uint256[8]));
        return decoded;
    }

    function isUserVerified(address user) view external returns(bool) {
        return verifiedUsers[user];
    } 

    function isUserVerified(uint256 nullifierHash) view external returns(bool) {
        return nullifierHashes[nullifierHash];
    } 

    function verifyAndExecute(
        address signal,
        uint256 root,
        uint256 nullifierHash,
        bytes calldata proof
    ) external {
        if (!verifiedUsers[signal]) {
            // First, we make sure this person hasn't done this before
            if (nullifierHashes[nullifierHash]) revert InvalidNullifier();
            uint256 newSignal = uint256(keccak256(abi.encodePacked(signal))) >>
                8;
            // We now verify the provided proof is valid and the user is verified by World ID
            worldId.verifyProof(
                root,
                groupId, // set to "1" in the constructor
                newSignal,
                nullifierHash,
                externalNullifierHash,
                decodeData(proof)
            );

            // We now record the user has done this, so they can't do it again (sybil-resistance)
            nullifierHashes[nullifierHash] = true;
            verifiedUsers[signal] = true;
        }
        // Finally, execute your logic here, knowing the user is verified
    }
}
