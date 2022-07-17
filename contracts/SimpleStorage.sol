// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SimpleStorage {
    mapping (address => uint256) addressToFavoriteNumber;

    function store(uint256 _favoriteNumber) public {
        addressToFavoriteNumber[msg.sender] = _favoriteNumber;
    }

    function myFavoriteNumber() view public returns (uint256 _favoriteNumber) {
        return addressToFavoriteNumber[msg.sender];
    }
}