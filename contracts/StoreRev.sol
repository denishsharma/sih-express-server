pragma solidity ^0.8.0;

contract  demo{
    
 struct IDRNS{
      uint ItemId; 
      string ItemName;
      uint Quantity;
      string ProviderInfo;
   }
  
   IDRNS[] public IDRN_Res; 
    uint256 public totalEntry;
   
   function insert( uint _ItemId, string memory _ItemName, uint _Quantity, string memory _ProviderInfo)public
   {
       IDRN_Res.push(IDRNS(_ItemId , _ItemName, _Quantity, _ProviderInfo));
       totalEntry++;
       }
   
  function fData(uint _ItemId)internal view returns(uint)
  {
      for(uint i =0; i< IDRN_Res.length; i++)
    {
        if(IDRN_Res[i].ItemId == _ItemId){
          return i;
            // return (IDRN_Res[i].ItemId, IDRN_Res[i].ItemName , IDRN_Res[i].Quantity , IDRN_Res[i].ProviderInfo);
        }
      }
      }

      function ReadData(uint _ItemId)public view returns(uint, string memory, uint, string memory)
  {
    uint i = fData(_ItemId);
    return (IDRN_Res[i].ItemId, IDRN_Res[i].ItemName , IDRN_Res[i].Quantity , IDRN_Res[i].ProviderInfo);
      }
    
}
