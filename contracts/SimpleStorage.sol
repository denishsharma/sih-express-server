// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {MetaTransaction} from "./MetaTransaction.sol";

contract SimpleStorage is MetaTransaction {
    event numberChanged (
        uint256 oldNumber,
        uint256 newNumber,
        address sender
    );

    event numberRetrieved (
        uint256 number,
        address sender
    );

    mapping(address => uint256) addressToFavoriteNumber;

    function store(uint256 _favoriteNumber) public meta {
        uint256 _old = addressToFavoriteNumber[mtxSigner];
        addressToFavoriteNumber[mtxSigner] = _favoriteNumber;
        emit numberChanged(_old, _favoriteNumber, mtxSigner);
    }

    function myFavoriteNumber() public meta returns (uint256 _favoriteNumber) {
        emit numberRetrieved(addressToFavoriteNumber[mtxSigner], mtxSigner);
        return addressToFavoriteNumber[mtxSigner];
    }
}