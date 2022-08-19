// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import "./MetaTransaction.sol";

contract Organizations is MetaTransaction {
    struct _logOrganization {
        string signature;
        address[] users;
    }

    string[] public organizations;
    mapping(string => address[]) public organizationUsers;

    event OrganizationCreated(string _organization, address _sender);
    event OrganizationDeleted(string _organization, bool _success, address _sender);
    event OrganizationUserAdded(string _organization, address _user, address _sender);
    event OrganizationUserRemoved(string _organization, address _user, address _sender);

    event Op_OrganizationUsers(string _organization, address[] _users);
    event Op_OrganizationList(string[] _organizations);
    event Op_OrganizationWithUsers(_logOrganization _organization);


    function addOrganization(string memory _signature) public meta {
        if (organizations.length == 0) {
            organizations.push(_signature);
            emit OrganizationCreated(_signature, mtxSigner);
        } else {
            for (uint i = 0; i < organizations.length; i++) {
                if (keccak256(abi.encodePacked(organizations[i])) == keccak256(abi.encodePacked(_signature))) {
                    return;
                }
            }
            organizations.push(_signature);
            emit OrganizationCreated(_signature, mtxSigner);
        }
    }

    function addUserToOrganization(string memory _signature, address _user) public meta {
        bool _found = false;
        for (uint i = 0; i < organizationUsers[_signature].length; i++) {
            if (organizationUsers[_signature][i] == _user) {
                _found = true;
                return;
            }
        }
        if (!_found) {
            organizationUsers[_signature].push(_user);
            emit OrganizationUserAdded(_signature, _user, mtxSigner);
        }
    }

    function addUsersToOrganization(string memory _signature, address[] memory _users) public meta {
        for (uint i = 0; i < _users.length; i++) {
            addUserToOrganization(_signature, _users[i]);
        }
    }

    function getOrganizationUsers(string memory _signature) public {
        emit Op_OrganizationUsers(_signature, organizationUsers[_signature]);
    }

    function getOrganizations() public {
        emit Op_OrganizationList(organizations);
    }

    function getOrganizationsWithUsers() public {
        for (uint i = 0; i < organizations.length; i++) {
            _logOrganization memory _organization;
            _organization.signature = organizations[i];
            _organization.users = organizationUsers[organizations[i]];
            emit Op_OrganizationWithUsers(_organization);
        }
    }

    function removeUserFromOrganization(string memory _signature, address _user) public meta {
        uint index = 0;
        while (index < organizationUsers[_signature].length) {
            if (organizationUsers[_signature][index] == _user) {
                delete organizationUsers[_signature][index];
            } else {
                index++;
            }
        }
        emit OrganizationUserRemoved(_signature, _user, mtxSigner);
    }

    function removeUsersFromOrganization(string memory _signature, address[] memory _users) public meta {
        for (uint i = 0; i < _users.length; i++) {
            removeUserFromOrganization(_signature, _users[i]);
        }
    }

    function deleteOrganization(string memory _signature) public meta {
        uint8 i = 0;
        for (i = 0; i < organizations.length; i++) {
            if (keccak256(abi.encodePacked(organizations[i])) == keccak256(abi.encodePacked(_signature))) {
                break;
            }
        }
        if (i < organizations.length) {
            delete organizations[i];
            delete organizationUsers[_signature];
            emit OrganizationDeleted(_signature, true, mtxSigner);
        }
    }
}
