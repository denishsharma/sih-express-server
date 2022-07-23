exports.numberAdded = async (error, result, raw) => {
    console.log("---------Add Number [numberAdded]-----------");
    console.log("Transaction:", raw.transactionHash);
    console.log("number (a):", result.number["a"]);
    console.log("number (b):", result.number["b"]);
    console.log("addition (c):", result.number["c"]);
    console.log("Sender", result.number["sender"]);
    console.log("--------------------------------------------" + "\n");
};

exports.numberUpdated = async (error, result, raw) => {
    console.log("---------Add Number [numberUpdated]-----------");
    console.log("Transaction:", raw.transactionHash);
    console.log("number (a):", result.number["a"]);
    console.log("number (b):", result.number["b"]);
    console.log("addition (c):", result.number["c"]);
    console.log("Sender", result.number["sender"]);
    console.log("----------------------------------------------" + "\n");
};