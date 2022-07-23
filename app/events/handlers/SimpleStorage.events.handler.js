exports.handleFavoriteNumber = async (error, result, raw) => {
    console.log("---------Simple Storage [numberChanged]-----------");
    console.log("Transaction:", raw.transactionHash);
    console.log("Old Number", result["oldNumber"]);
    console.log("New Number", result["newNumber"]);
    console.log("Sender", result["sender"]);
    console.log("--------------------------------------------------" + "\n");
};