// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import "./MetaTransaction.sol";

contract Tasks is MetaTransaction {
    // task belongs to many teams <> team has many tasks

    // createTask(signature) [TaskCreated(signature, sender)] >
    // addTaskToTeam(signature, teamId) [TaskAdded(signature, teamId, sender)] >
    // removeTaskFromTeam(signature, teamId) [TaskRemoved(signature, teamId, sender)] >
    // getTeams(signature) [Op_getTeams(signature, teams[])] :: task belongs to many teams
    // getTasks(teamId) [Op_getTasks(teamId, tasks[])] :: team has many tasks

    struct _logTask {
        string signature;
        address[] teams;
    }

    string[] public tasks;
    string[] public teams;
    mapping(string => string[]) public taskBelongsToTeams; // task => teams
    mapping(string => string[]) public teamHasManyTasks; // team => tasks

    event TaskCreated(string _signature, address _sender);
    event TaskAdded(string _signature, string _teamId, address _sender);
    event TaskRemoved(string _signature, string _teamId, address _sender);

    event Op_getTeams(string _signature, string[] _teams);
    event Op_getTasks(string _teamId, string[] _tasks);

    function createTask(string memory _signature) public meta {
        if (tasks.length == 0) {
            tasks.push(_signature);
            emit TaskCreated(_signature, mtxSigner);
        } else {
            for (uint i = 0; i < tasks.length; i++) {
                if (keccak256(abi.encodePacked(tasks[i])) == keccak256(abi.encodePacked(_signature))) {
                    return;
                }
            }
            tasks.push(_signature);
            emit TaskCreated(_signature, mtxSigner);
        }
    }

    function addTaskToTeam(string memory _signature, string memory _teamId) public meta {
        bool _found = false;
        for (uint i = 0; i < taskBelongsToTeams[_signature].length; i++) {
            if (keccak256(abi.encodePacked(taskBelongsToTeams[_signature][i])) == keccak256(abi.encodePacked(_teamId))) {
                _found = true;
                return;
            }
        }

        if (!_found) {
            taskBelongsToTeams[_signature].push(_teamId);
            teamHasManyTasks[_teamId].push(_signature);
            emit TaskAdded(_signature, _teamId, mtxSigner);
        }
    }

    function addTaskToTeams(string memory _signature, string[] memory _teams) public meta {
        for (uint i = 0; i < _teams.length; i++) {
            addTaskToTeam(_signature, _teams[i]);
        }
    }

    function addTasksToTeam(string memory _teamId, string[] memory _tasks) public meta {
        for (uint i = 0; i < _tasks.length; i++) {
            addTaskToTeam(_tasks[i], _teamId);
        }
    }

    function removeTaskFromTeam(string memory _signature, string memory _teamId) public meta {
        bool _foundInTeams = false;
        for (uint i = 0; i < taskBelongsToTeams[_signature].length; i++) {
            if (keccak256(abi.encodePacked(taskBelongsToTeams[_signature][i])) == keccak256(abi.encodePacked(_teamId))) {
                delete taskBelongsToTeams[_signature][i];
                _foundInTeams = true;
                break;
            }
        }

        bool _foundInTasks = false;
        for (uint i = 0; i < teamHasManyTasks[_teamId].length; i++) {
            if (keccak256(abi.encodePacked(teamHasManyTasks[_teamId][i])) == keccak256(abi.encodePacked(_signature))) {
                delete teamHasManyTasks[_teamId][i];
                _foundInTasks = true;
                break;
            }
        }

        if (_foundInTeams && _foundInTasks) {
            emit TaskRemoved(_signature, _teamId, mtxSigner);
        }
    }

    function removeTaskFromTeams(string memory _signature, string[] memory _teams) public meta {
        for (uint i = 0; i < _teams.length; i++) {
            removeTaskFromTeam(_signature, _teams[i]);
        }
    }

    function removeTasksFromTeam(string memory _teamId, string[] memory _tasks) public meta {
        for (uint i = 0; i < _tasks.length; i++) {
            removeTaskFromTeam(_tasks[i], _teamId);
        }
    }

    function getTeams(string memory _signature) public {
        string[] memory _teams = taskBelongsToTeams[_signature];
        emit Op_getTeams(_signature, _teams);
    }

    function getTasks(string memory _teamId) public {
        string[] memory _tasks = teamHasManyTasks[_teamId];
        emit Op_getTasks(_teamId, _tasks);
    }


}
