exports.logRecord = async (error, result, raw) => {
    console.log("---------Log Record [logRecord]-----------");
    console.log("Transaction:", raw.transactionHash);
    console.log("Operation:", result["_operation"]);
    console.log("Metadata:", result["_metadata"]);
    console.log("Values:", result["_values"]);
    console.log("Fields:", result["_fields"]);
    console.log("Flags:", result["_itemFlags"]);
    console.log("Sender:", result["_sender"]);
    console.log("--------------------------------------");
};