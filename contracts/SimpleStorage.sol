// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SimpleStorage {
    event numberChanged (
        uint256 oldNumber,
        uint256 newNumber,
        address sender
    );

    mapping (address => uint256) addressToFavoriteNumber;

    function store(uint256 _favoriteNumber) public {
        uint256 _old = addressToFavoriteNumber[msg.sender];
        addressToFavoriteNumber[msg.sender] = _favoriteNumber;
        emit numberChanged(_old, _favoriteNumber, msg.sender);
    }

    function myFavoriteNumber() view public returns (uint256 _favoriteNumber) {
        return addressToFavoriteNumber[msg.sender];
    }
}