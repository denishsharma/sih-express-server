// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {MetaTransaction} from "./MetaTransaction.sol";

contract Teams is MetaTransaction {

    // holds for relation
    // team has many tasks <> task belongs to many teams
    // team has many users <> user belongs to many teams

    string[] public teamIds;
    string[] public taskIds;
    address[] public teamMembers;

    mapping(string => string[]) public teamHasManyTasks; // teamId => taskIds
    mapping(string => string[]) public taskBelongsToTeams; // taskId => teamIds

    mapping(string => address[]) public teamHasManyMembers; // teamId => memberAddresses
    mapping(address => string[]) public memberBelongsToTeams; // memberAddress => teamIds

    event TeamCreated(string _teamId, address _sender);
    event TeamDeleted(string _teamId, bool _success, address _sender);

    event TaskAssigned(string _taskId, string _teamId, address _sender);
    event TaskUnassigned(string _taskId, string _teamId, address _sender);

    event TeamMemberAdded(string _teamId, address _memberAddress, address _sender);
    event TeamMemberRemoved(string _teamId, address _memberAddress, address _sender);

    event Op_TeamIds(string[] _teamIds);
    event Op_TaskIds(string[] _taskIds);
    event Op_TeamMembers(address[] _teamMembers);

    function getTeamIds() public returns (string[] memory) {
        emit Op_TeamIds(teamIds);
        return teamIds;
    }

    function getTaskIds() public returns (string[] memory) {
        emit Op_TaskIds(taskIds);
        return taskIds;
    }

    function getTeamMemberAddresses() public returns (address[] memory) {
        emit Op_TeamMembers(teamMembers);
        return teamMembers;
    }

    function getMembersFromTeam(string memory _teamId) public returns (address[] memory) {
        emit Op_TeamMembers(teamHasManyMembers[_teamId]);
        return teamHasManyMembers[_teamId];
    }

    function getTasksFromTeam(string memory _teamId) public returns (string[] memory) {
        emit Op_TaskIds(teamHasManyTasks[_teamId]);
        return teamHasManyTasks[_teamId];
    }

    function getTeamsFromMember(address _memberAddress) public returns (string[] memory) {
        emit Op_TeamIds(memberBelongsToTeams[_memberAddress]);
        return memberBelongsToTeams[_memberAddress];
    }

    function getTeamsFromTask(string memory _taskId) public returns (string[] memory) {
        emit Op_TeamIds(taskBelongsToTeams[_taskId]);
        return taskBelongsToTeams[_taskId];
    }

    function _foundTeam(string memory _teamId) internal view returns (bool) {
        for (uint i = 0; i < teamIds.length; i++) {
            if (keccak256(abi.encodePacked(teamIds[i])) == keccak256(abi.encodePacked(_teamId))) {
                return true;
            }
        }
        return false;
    }

    function _foundTask(string memory _taskId) internal view returns (bool) {
        for (uint i = 0; i < taskIds.length; i++) {
            if (keccak256(abi.encodePacked(taskIds[i])) == keccak256(abi.encodePacked(_taskId))) {
                return true;
            }
        }
        return false;
    }

    function _foundMember(address _memberAddress) internal view returns (bool) {
        for (uint i = 0; i < teamMembers.length; i++) {
            if (keccak256(abi.encodePacked(teamMembers[i])) == keccak256(abi.encodePacked(_memberAddress))) {
                return true;
            }
        }
        return false;
    }

    function _teamHasNoTasks(string memory _teamId) internal view returns (bool) {
        for (uint i = 0; i < teamHasManyTasks[_teamId].length; i++) {
            if (keccak256(abi.encodePacked(teamHasManyTasks[_teamId][i])) != keccak256(abi.encodePacked(""))) {
                return false;
            }
        }
        return true;
    }

    function _teamHasTask(string memory _teamId, string memory _taskId) internal view returns (bool) {
        for (uint i = 0; i < teamHasManyTasks[_teamId].length; i++) {
            if (keccak256(abi.encodePacked(teamHasManyTasks[_teamId][i])) == keccak256(abi.encodePacked(_taskId))) {
                return true;
            }
        }
        return false;
    }

    function _taskBelongsToTeam(string memory _taskId, string memory _teamId) internal view returns (bool) {
        for (uint i = 0; i < taskBelongsToTeams[_taskId].length; i++) {
            if (keccak256(abi.encodePacked(taskBelongsToTeams[_taskId][i])) == keccak256(abi.encodePacked(_teamId))) {
                return true;
            }
        }
        return false;
    }

    function _teamHasNoMembers(string memory _teamId) internal view returns (bool) {
        for (uint i = 0; i < teamHasManyMembers[_teamId].length; i++) {
            if (keccak256(abi.encodePacked(teamHasManyMembers[_teamId][i])) != keccak256(abi.encodePacked(""))) {
                return false;
            }
        }
        return true;
    }

    function _teamHasMember(string memory _teamId, address _memberAddress) internal view returns (bool) {
        for (uint i = 0; i < teamHasManyMembers[_teamId].length; i++) {
            if (keccak256(abi.encodePacked(teamHasManyMembers[_teamId][i])) == keccak256(abi.encodePacked(_memberAddress))) {
                return true;
            }
        }
        return false;
    }

    function _memberBelongsToTeam(address _memberAddress, string memory _teamId) internal view returns (bool) {
        for (uint i = 0; i < memberBelongsToTeams[_memberAddress].length; i++) {
            if (keccak256(abi.encodePacked(memberBelongsToTeams[_memberAddress][i])) == keccak256(abi.encodePacked(_teamId))) {
                return true;
            }
        }
        return false;
    }

    function createTeam(string memory _string) public meta {
        if (_foundTeam(_string)) {
            return;
        }

        teamIds.push(_string);
        emit TeamCreated(_string, mtxSigner);
    }

    function assignTaskToTeam(string memory _taskId, string memory _teamId) public meta {
        if (!_foundTeam(_teamId)) {
            teamIds.push(_teamId);
            emit TeamCreated(_teamId, mtxSigner);
        }

        if (!_foundTask(_taskId)) {
            taskIds.push(_taskId);
        }

        if ((_teamHasNoTasks(_teamId) || !_teamHasTask(_teamId, _taskId)) && !_taskBelongsToTeam(_taskId, _teamId)) {
            teamHasManyTasks[_teamId].push(_taskId);
            taskBelongsToTeams[_taskId].push(_teamId);
            emit TaskAssigned(_taskId, _teamId, mtxSigner);
        }
    }

    function assignTaskToTeams(string memory _taskId, string[] memory _teamIds) public meta {
        for (uint i = 0; i < _teamIds.length; i++) {
            assignTaskToTeam(_taskId, _teamIds[i]);
        }
    }

    function assignTasksToTeam(string[] memory _taskIds, string memory _teamId) public meta {
        for (uint i = 0; i < _taskIds.length; i++) {
            assignTaskToTeam(_taskIds[i], _teamId);
        }
    }

    function unassignTaskFromTeam(string memory _taskId, string memory _teamId) public meta {
        if (_taskBelongsToTeam(_taskId, _teamId) && _teamHasTask(_teamId, _taskId)) {
            for (uint i = 0; i < taskBelongsToTeams[_taskId].length; i++) {
                if (keccak256(abi.encodePacked(taskBelongsToTeams[_taskId][i])) == keccak256(abi.encodePacked(_teamId))) {
                    delete taskBelongsToTeams[_taskId][i];
                    break;
                }
            }

            for (uint i = 0; i < teamHasManyTasks[_teamId].length; i++) {
                if (keccak256(abi.encodePacked(teamHasManyTasks[_teamId][i])) == keccak256(abi.encodePacked(_taskId))) {
                    delete teamHasManyTasks[_teamId][i];
                    break;
                }
            }

            emit TaskUnassigned(_taskId, _teamId, mtxSigner);
        }
    }

    function unassignTaskFromTeams(string memory _taskId, string[] memory _teamIds) public meta {
        for (uint i = 0; i < _teamIds.length; i++) {
            unassignTaskFromTeam(_taskId, _teamIds[i]);
        }
    }

    function unassignTasksFromTeam(string[] memory _taskIds, string memory _teamId) public meta {
        for (uint i = 0; i < _taskIds.length; i++) {
            unassignTaskFromTeam(_taskIds[i], _teamId);
        }
    }

    function addMemberToTeam(address _memberAddress, string memory _teamId) public meta {
        if (!_foundTeam(_teamId)) {
            teamIds.push(_teamId);
            emit TeamCreated(_teamId, mtxSigner);
        }
        if (!_foundMember(_memberAddress)) {
            teamMembers.push(_memberAddress);
        }
        if ((_teamHasNoMembers(_teamId) || !_teamHasMember(_teamId, _memberAddress)) && !_memberBelongsToTeam(_memberAddress, _teamId)) {
            teamHasManyMembers[_teamId].push(_memberAddress);
            memberBelongsToTeams[_memberAddress].push(_teamId);
            emit TeamMemberAdded(_teamId, _memberAddress, mtxSigner);
        }
    }

    function addMemberToTeams(address _memberAddress, string[] memory _teamIds) public meta {
        for (uint i = 0; i < _teamIds.length; i++) {
            addMemberToTeam(_memberAddress, _teamIds[i]);
        }
    }

    function addMembersToTeam(address[] memory _memberAddresses, string memory _teamId) public meta {
        for (uint i = 0; i < _memberAddresses.length; i++) {
            addMemberToTeam(_memberAddresses[i], _teamId);
        }
    }

    function removeMemberFromTeam(address _memberAddress, string memory _teamId) public meta {
        if (_memberBelongsToTeam(_memberAddress, _teamId) && _teamHasMember(_teamId, _memberAddress)) {
            for (uint i = 0; i < memberBelongsToTeams[_memberAddress].length; i++) {
                if (keccak256(abi.encodePacked(memberBelongsToTeams[_memberAddress][i])) == keccak256(abi.encodePacked(_teamId))) {
                    delete memberBelongsToTeams[_memberAddress][i];
                    break;
                }
            }

            for (uint i = 0; i < teamHasManyMembers[_teamId].length; i++) {
                if (keccak256(abi.encodePacked(teamHasManyMembers[_teamId][i])) == keccak256(abi.encodePacked(_memberAddress))) {
                    delete teamHasManyMembers[_teamId][i];
                    break;
                }
            }

            emit TeamMemberRemoved(_teamId, _memberAddress, mtxSigner);
        }
    }

    function removeMemberFromTeams(address _memberAddress, string[] memory _teamIds) public meta {
        for (uint i = 0; i < _teamIds.length; i++) {
            removeMemberFromTeam(_memberAddress, _teamIds[i]);
        }
    }

    function removeMembersFromTeam(address[] memory _memberAddresses, string memory _teamId) public meta {
        for (uint i = 0; i < _memberAddresses.length; i++) {
            removeMemberFromTeam(_memberAddresses[i], _teamId);
        }
    }
}