// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {MetaTransaction} from "./MetaTransaction.sol";

contract Tasks is MetaTransaction {

    // holds for relation
    // task has many tickets <> ticket belongs to one task
    // task has one report <> report belongs to one task

    string[] public taskIds;
    string[] public ticketIds;
    string[] public reportIds;

    mapping(string => string[]) public taskHasManyTickets; // taskId => ticketIds
    mapping(string => string) public ticketBelongsToOneTask; // ticketId => taskId

    mapping(string => string) public taskHasOneReport; // taskId => reportId
    mapping(string => string) public reportBelongsToOneTask; // reportId => taskId

    event TaskCreated(string taskId, address _sender);
    event TaskDeleted(string taskId, bool _success, address _sender);

    event TicketAssigned(string ticketId, string taskId, address _sender);
    event TicketUnassigned(string ticketId, string taskId, address _sender);

    event ReportAssigned(string reportId, string taskId, address _sender);
    event ReportUnassigned(string reportId, string taskId, address _sender);

    event Op_TaskIds(string[] _taskIds);
    event Op_TicketIds(string[] _ticketIds);
    event Op_ReportIds(string[] _reportIds);
    event Op_ReportId(string _reportId);

    function getTaskIds() public returns (string[] memory _taskIds) {
        emit Op_TaskIds(taskIds);
        return taskIds;
    }

    function getTicketIds() public returns (string[] memory _ticketIds) {
        emit Op_TicketIds(ticketIds);
        return ticketIds;
    }

    function getReportIds() public returns (string[] memory _reportIds) {
        emit Op_ReportIds(reportIds);
        return reportIds;
    }

    function getTicketsFromTask(string _taskId) public returns (string[] memory _ticketIds) {
        _ticketIds = taskHasManyTickets[_taskId];
        emit Op_TicketIds(_ticketIds);
        return _ticketIds;
    }

    function getReportFromTask(string _taskId) public returns (string memory _reportId) {
        _reportId = taskHasOneReport[_taskId];
        emit Op_ReportId(_reportId);
        return _reportId;
    }

    function _foundTask(string memory _taskId) internal view returns (bool) {
        for (uint i = 0; i < taskIds.length; i++) {
            if (taskIds[i] == _taskId) {
                return true;
            }
        }
        return false;
    }

    function _foundTicket(string memory _ticketId) internal view returns (bool) {
        for (uint i = 0; i < ticketIds.length; i++) {
            if (ticketIds[i] == _ticketId) {
                return true;
            }
        }
        return false;
    }

    function _foundReport(string memory _reportId) internal view returns (bool) {
        for (uint i = 0; i < reportIds.length; i++) {
            if (reportIds[i] == _reportId) {
                return true;
            }
        }
        return false;
    }

    function _taskHasNoTickets(string memory _taskId) internal view returns (bool) {
        for (uint i = 0; i < taskHasManyTickets[_taskId].length; i++) {
            if (keccak256(abi.encodePacked(taskHasManyTickets[_taskId][i])) != keccak256(abi.encodePacked(""))) {
                return false;
            }
        }
        return true;
    }

    function _taskHashTicket(string memory _taskId, string memory _ticketId) internal view returns (bool) {
        for (uint i = 0; i < taskHasManyTickets[_taskId].length; i++) {
            if (keccak256(abi.encodePacked(taskHasManyTickets[_taskId][i])) == keccak256(abi.encodePacked(_ticketId))) {
                return true;
            }
        }
        return false;
    }

    function _ticketBelongsToTask(string memory _ticketId, string memory _taskId) internal view returns (bool) {
        if (keccak256(abi.encodePacked(ticketBelongsToOneTask[_ticketId])) == keccak256(abi.encodePacked(_taskId))) {
            return true;
        }
        return false;
    }

    function _taskHasNoReport(string memory _taskId) internal view returns (bool) {
        if (keccak256(abi.encodePacked(taskHasOneReport[_taskId])) != keccak256(abi.encodePacked(""))) {
            return false;
        }
        return true;
    }

    function _reportBelongsToTask(string memory _reportId, string memory _taskId) internal view returns (bool) {
        if (keccak256(abi.encodePacked(reportBelongsToOneTask[_reportId])) == keccak256(abi.encodePacked(_taskId))) {
            return true;
        }
        return false;
    }

    function createTask(string _taskId, address _sender) public {
        if (taskIds.length > 0) {
            require(_taskId != taskIds[0]);
        }
        taskIds.push(_taskId);
        taskHasManyTickets[_taskId] = new string[](0);
        taskHasOneReport[_taskId] = "";
        emit TaskCreated(_taskId, _sender);
    }

}