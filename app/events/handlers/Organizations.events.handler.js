exports.organizationCreated = async (error, result, raw) => {
    console.log("---------Organization Created [organizationCreated]-----------");
    console.log("Transaction:", raw.transactionHash);
    console.log("Organization:", result["_organization"]);
    console.log("Sender", result["_sender"]);
    console.log("--------------------------------------------------------------" + "\n");
};

exports.organizationDeleted = async (error, result, raw) => {
    console.log("---------Organization Deleted [organizationDeleted]-----------");
    console.log("Transaction:", raw.transactionHash);
    console.log("Organization:", result["_organization"]);
    console.log("Success", result["_success"]);
    console.log("Sender", result["_sender"]);
    console.log("--------------------------------------------------------------" + "\n");
};

exports.organizationUserAdded = async (error, result, raw) => {
    console.log("---------Organization User Added [organizationUserAdded]-----------");
    console.log("Transaction:", raw.transactionHash);
    console.log("Organization:", result["_organization"]);
    console.log("User:", result["_user"]);
    console.log("Sender", result["_sender"]);
    console.log("-------------------------------------------------------------------" + "\n");
};

exports.organizationUserRemoved = async (error, result, raw) => {
    console.log("---------Organization User Removed [organizationUserRemoved]-----------");
    console.log("Transaction:", raw.transactionHash);
    console.log("Organization:", result["_organization"]);
    console.log("User:", result["_user"]);
    console.log("Sender", result["_sender"]);
    console.log("-----------------------------------------------------------------------" + "\n");
};