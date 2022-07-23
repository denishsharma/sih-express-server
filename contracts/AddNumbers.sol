// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./MultiplyNumbers.sol";

contract AddNumbers is MultiplyNumbers {
    struct Number {
        uint a;
        uint b;
        uint c;
        address sender;
        bool flag;
    }

    event numberAdded(Number number);
    event numberUpdated(Number number);

    mapping(address => Number) public addressToNumbers;

    modifier onlyOnce {
        if (addressToNumbers[msg.sender].flag == true) {
            revert('Already added');
        }
        _;
    }

    function addNumber(uint _a, uint _b) public onlyOnce {
        Number memory number;
        number.a = _a;
        number.b = _b;
        number.c = times((_a + _b), 2);
        number.sender = msg.sender;
        number.flag = true;
        addressToNumbers[msg.sender] = number;

        emit numberAdded(number);
    }

    function updateNumber(uint _a, uint _b) public {
        Number memory number = addressToNumbers[msg.sender];
        if (number.flag == true) {
            number.a = _a;
            number.b = _b;
            number.c = times((_a + _b), 2);
            addressToNumbers[msg.sender] = number;

            emit numberUpdated(number);
        } else {
            revert('Not added');
        }
    }

    function getNumber() public view returns (Number memory) {
        return addressToNumbers[msg.sender];
    }
}
