// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MetaTransaction {

    address internal mtxSigner = msg.sender;
    mapping(address => uint256) public nonces;

    modifier meta {
        if (mtxSigner == address(0)) {
            mtxSigner = msg.sender;
            _;
            mtxSigner = address(0);
        } else {
            _;
        }
    }

    function recover(bytes32 hash, bytes memory sig) internal pure returns (address) {
        bytes32 r;
        bytes32 s;
        uint8 v;

        if (sig.length != 65) {
            return (address(0));
        }

        assembly {
            r := mload(add(sig, 32))
            s := mload(add(sig, 64))
            v := byte(0, mload(add(sig, 96)))
        }

        if (v < 27) {
            v += 27;
        }

        if (v != 27 && v != 28) {
            return (address(0));
        } else {
            return ecrecover(hash, v, r, s);
        }
    }

    function sign(address sender, address target, bytes memory data, uint256 nonce, bytes32 hash, bytes memory sig) public payable {
        require(address(this) == target);

        mtxSigner = recover(hash, sig);
        require(mtxSigner == sender);
        require(nonces[mtxSigner]++ == nonce);

        (bool success,) = target.call{value : msg.value, gas : gasleft()}(data);
        require(success);
        mtxSigner = address(0);
    }
}
