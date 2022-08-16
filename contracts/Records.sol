// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;

contract Records {
    struct RecordItem {
        string recordId;
        string[] metadata;
        string[] values;
        string[] fields;
    }

    string[] records;
    mapping(string => RecordItem) signatureToRecordItem;
    mapping(string => uint8[12]) recordToFlags;

    event logArray(string[] _array);

    event LogRecord(
        string _operation,
        string _recordId,
        string[] _metadata,
        string[] _values,
        string[] _fields,
        uint8[12] _itemFlags,
        address _sender
    );

    function createRecord(string memory _recordId, string[] memory _metadata, string[] memory _values, string[] memory _fields) public returns (bool) {
        RecordItem memory _recordItem;
        _recordItem.recordId = _recordId;
        _recordItem.metadata = _metadata;
        _recordItem.values = _values;
        _recordItem.fields = _fields;

        /*
         1 - Delete (0:no, 1:no)
         2 - ReadOnly (1:yes, 0:no)
         3 - Added (1:yes, 0:no)
         */
        uint8[12] memory _flags = [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        recordToFlags[_recordId] = _flags;

        records.push(_recordId);
        signatureToRecordItem[_recordId] = _recordItem;


        if (recordToFlags[_recordId][2] == 1) {
            emit LogRecord("create", _recordItem.recordId, _recordItem.metadata, _recordItem.values, _recordItem.fields, recordToFlags[_recordId], msg.sender);
            return true;
        }

        return false;
    }

    function readRecord(string memory _recordId) public returns (RecordItem memory R_recordItem, uint8[12] memory R_flags) {
        RecordItem memory _recordItem = signatureToRecordItem[_recordId];
        uint8[12] memory _flags = recordToFlags[_recordId];

        emit LogRecord("read", _recordItem.recordId, _recordItem.metadata, _recordItem.values, _recordItem.fields, recordToFlags[_recordId], msg.sender);

        if (_flags[0] == 1 && _flags[2] == 1) {
            return (_recordItem, _flags);

        } else {
            RecordItem memory _emptyRecordItem;
            return (_emptyRecordItem, _flags);
        }
    }
}