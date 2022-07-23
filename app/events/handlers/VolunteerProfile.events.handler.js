exports.profileAdded = async (error, result, raw) => {
    if (!error) {
        console.log("Profile added:", result);
    } else {
        console.log("Error adding profile:", error);
    }
};

exports.profileUpdated = async (error, result, raw) => {
    if (!error) {
        console.log("Profile updated:", result);
    } else {
        console.log("Error updating profile:", error);
    }
};

exports.editorAccessUpdated = async (error, result, raw) => {
    if (!error) {
        console.log("Editor access updated:", result);
    } else {
        console.log("Error updating editor access:", error);
    }
};