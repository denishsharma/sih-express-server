exports.parseToJSONObject = (obj) => {
    return JSON.parse(JSON.stringify(obj));
};

exports.addTimestamps = (obj) => {
    if (!obj.createdAt && !obj.createdAt) {
        obj.createdAt = new Date();
        obj.updatedAt = new Date();
    }
};

exports.fieldOptionCheckDefaults = (option) => {
    if (!option.default) {
        option.default = false;
    }
    if (!option.usage) {
        option.usage = 0;
    }
    if (!option.fixed) {
        option.fixed = false;
    }
    this.addTimestamps(option);
};