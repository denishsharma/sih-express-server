// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import "./MetaTransaction.sol";

contract Teams is MetaTransaction {
    address[] public users;
    string[] public teams;
    mapping(address => string[]) public userBelongsToTeams; // user => teams
    mapping(string => address[]) public teamHasManyUsers; // team => users

    event TeamCreated(string _teamId, address _sender);
    event TeamAdded(string _teamId, address _user, address _sender);
    event TeamRemoved(string _teamId, address _user, address _sender);

    event Op_userRemoved(address _user, string _teamId, address _sender);
    event Op_getTeams(address _user, string[] _teams);
    event Op_getUsers(string _teamId, address[] _users);

    function createTeam(string memory _teamId) public meta {
        if (teams.length == 0) {
            teams.push(_teamId);
            emit TeamCreated(_teamId, mtxSigner);
        } else {
            for (uint i = 0; i < teams.length; i++) {
                if (keccak256(abi.encodePacked(teams[i])) == keccak256(abi.encodePacked(_teamId))) {
                    return;
                }
            }
            teams.push(_teamId);
            emit TeamCreated(_teamId, mtxSigner);
        }
    }

    function addUserToTeam(address _user, string memory _teamId) public meta {
        bool _found = false;
        for (uint i = 0; i < userBelongsToTeams[_user].length; i++) {
            if (keccak256(abi.encodePacked(userBelongsToTeams[_user][i])) == keccak256(abi.encodePacked(_teamId))) {
                _found = true;
                return;
            }
        }

        if (!_found) {
            userBelongsToTeams[_user].push(_teamId);
            teamHasManyUsers[_teamId].push(_user);
            emit TeamAdded(_teamId, _user, mtxSigner);
        }
    }

    function addUserToTeams(address _user, string[] memory _teams) public meta {
        for (uint i = 0; i < _teams.length; i++) {
            addUserToTeam(_user, _teams[i]);
        }
    }

    function addUsersToTeam(address[] memory _users, string memory _team) public meta {
        for (uint i = 0; i < _users.length; i++) {
            addUserToTeam(_users[i], _team);
        }
    }

    function removeTeamFromUser(string memory _teamId, address _user) public meta {
        bool _foundInTeams = false;
        for (uint i = 0; i < teamHasManyUsers[_teamId].length; i++) {
            if (teamHasManyUsers[_teamId][i] == _user) {
                delete userBelongsToTeams[_user][i];
                _foundInTeams = true;
                break;
            }
        }

        bool _foundInUsers = false;
        for (uint i = 0; i < userBelongsToTeams[_user].length; i++) {
            if (keccak256(abi.encodePacked(userBelongsToTeams[_user][i])) == keccak256(abi.encodePacked(_teamId))) {
                delete teamHasManyUsers[_teamId][i];
                _foundInUsers = true;
            }
        }

        if (_foundInUsers && _foundInTeams) {
            emit TeamRemoved(_teamId, _user, mtxSigner);
        }
    }

    function removeTeamFromUsers(string memory _teamId, address[] memory _users) public meta {
        for (uint i = 0; i < _users.length; i++) {
            removeTeamFromUser(_teamId, _users[i]);
        }
    }

    function removeTeamsFromUser(string[] memory _teams, address _user) public meta {
        for (uint i = 0; i < _teams.length; i++) {
            removeTeamFromUser(_teams[i], _user);
        }
    }

    function removeUserFromTeam(address _user, string memory _teamId) public meta {
        bool _foundInTeams = false;
        for (uint i = 0; i < userBelongsToTeams[_user].length; i++) {
            if (keccak256(abi.encodePacked(userBelongsToTeams[_user][i])) == keccak256(abi.encodePacked(_teamId))) {
                delete userBelongsToTeams[_user][i];
                _foundInTeams = true;
                break;
            }
        }

        bool foundInUsers = false;
        for (uint i = 0; i < teamHasManyUsers[_teamId].length; i++) {
            if (teamHasManyUsers[_teamId][i] == _user) {
                delete teamHasManyUsers[_teamId][i];
                foundInUsers = true;
                break;
            }
        }

        if (_foundInTeams && foundInUsers) {
            emit Op_userRemoved(_user, _teamId, mtxSigner);
        }
    }

    function removeUserFromTeams(address _user, string[] memory _teams) public meta {
        for (uint i = 0; i < _teams.length; i++) {
            removeUserFromTeam(_user, _teams[i]);
        }
    }

    function removeUsersFromTeam(address[] memory _users, string memory _teamId) public meta {
        for (uint i = 0; i < _users.length; i++) {
            removeUserFromTeam(_users[i], _teamId);
        }
    }

    function getTeams(address _user) public {
        emit Op_getTeams(_user, userBelongsToTeams[_user]);
    }

    function getUsers(string memory _teamId) public {
        emit Op_getUsers(_teamId, teamHasManyUsers[_teamId]);
    }
}