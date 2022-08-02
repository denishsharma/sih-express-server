// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract  demo{

struct IDRNS{
    uint ItemId; 
    string ItemName;
    uint Quantity;
    string ProviderInfo;
    }

event ResMan(uint ItemId, 
    string ItemName,
    uint Quantity,
    string ProviderInfo);

IDRNS[] public IDRN_Res; 
uint256 public totalEntry;

function insert( uint _ItemId, string memory _ItemName, uint _Quantity, string memory _ProviderInfo)public{
    IDRN_Res.push(IDRNS(_ItemId , _ItemName, _Quantity, _ProviderInfo));
    emit ResMan(_ItemId, _ItemName, _Quantity, _ProviderInfo);
    totalEntry++;
    }

function fData(uint _ItemId)internal view returns(uint){
    for(uint i =0; i< IDRN_Res.length; i++){
        if(IDRN_Res[i].ItemId == _ItemId){
            return i;
            }
            }
            }
            
function ReadData(uint _ItemId)public view returns(uint, string memory, uint, string memory){
    uint i = fData(_ItemId);
    return (IDRN_Res[i].ItemId, IDRN_Res[i].ItemName , IDRN_Res[i].Quantity , IDRN_Res[i].ProviderInfo);
    }

function updateData(uint _ItemId, string memory _ItemName, uint _Quantity, string memory _ProviderInfo) public returns (bool) {

        for(uint i = 0; i < IDRN_Res.length; i++) {
            if(IDRN_Res[i].ItemId == _ItemId) {
                IDRN_Res[i].ItemName = _ItemName;
                IDRN_Res[i].Quantity = _Quantity;
                IDRN_Res[i].ProviderInfo = _ProviderInfo;
            }
        }

        emit ResMan(_ItemId, _ItemName, _Quantity, _ProviderInfo);

        return true;
    }

function deleteData(uint256 _ItemId) public returns (bool) {

        for(uint i = 0; i < IDRN_Res.length; i++) {
            if(IDRN_Res[i].ItemId == _ItemId) {
                delete IDRN_Res[i];
            }
        }

        totalEntry--;

        return true;
    }
}
