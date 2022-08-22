const { Tasks } = require("../contracts");
const { isRequestEmpty } = require("../utils/requests.utils");
const { decodeToken } = require("../utils/jwt.utils");
const { unlockUserAddress } = require("../utils/secure.utils");
const { sendSignedMetaTransaction, processEventLogs } = require("../utils/wallet.utils");
const { parseToJSONObject } = require("../utils/general.utils");
const Web3Config = require("../configs/web3.config");

exports.create = async (req, res) => {
    if (isRequestEmpty(req)) {
        return res.status(400).json({
            message: "Request body is empty",
        });
    }

    const { signature, userToken } = req.body;

    const decoded = decodeToken(userToken);
    const unlockedUser = unlockUserAddress(decoded);

    if (!signature) {
        return res.status(400).json({
            message: "Signature is required",
        });
    }

    const txReceipt = await sendSignedMetaTransaction(Tasks, unlockedUser.address, unlockedUser.secret, {
        gas: Web3Config.transaction.gas.high,
    }, "createTask", signature);
    const logs = await processEventLogs(Tasks, txReceipt.logs);
    const taskCreatedSignature = logs.filter((log) => log.name === "TaskCreated").map((log) => log.data["_signature"])[0];

    if (taskCreatedSignature !== signature) {
        return res.status(500).json({
            message: "An error occurred while creating the task",
        });
    }

    return res.json({
        message: "Task created successfully",
    });
};

exports.getTeams = async (req, res) => {
    const { signature } = req.params;
    const { userToken } = req.body;

    const decoded = decodeToken(userToken);
    const unlockedUser = unlockUserAddress(decoded);

    if (!signature) {
        return res.status(400).json({
            message: "Signature is required",
        });
    }

    const txReceipt = await sendSignedMetaTransaction(Tasks, unlockedUser.address, unlockedUser.secret, {
        gas: Web3Config.transaction.gas.high,
    }, "getTaskWithTeams", signature);
    const logs = await processEventLogs(Tasks, txReceipt.logs);

    const _teams = logs.filter((log) => log.name === "Op_TaskWithTeams").map((log) => log.data["_teamIds"])[0];

    return res.json({
        data: {
            task: signature,
            teams: _teams,
        },
        message: "Teams found successfully for task",
    });
};

exports.getTasks = async (req, res) => {
    const { teamId } = req.params;
    const { userToken } = req.body;

    const decoded = decodeToken(userToken);
    const unlockedUser = unlockUserAddress(decoded);

    if (!teamId) {
        return res.status(400).json({
            message: "Team id is required",
        });
    }

    const txReceipt = await sendSignedMetaTransaction(Tasks, unlockedUser.address, unlockedUser.secret, {
        gas: Web3Config.transaction.gas.high,
    }, "getTeamWithTasks", teamId);
    const logs = await processEventLogs(Tasks, txReceipt.logs);

    const _tasks = logs.filter((log) => log.name === "Op_TeamWithTasks").map((log) => log.data["_taskIds"])[0];

    return res.json({
        data: {
            team: teamId,
            tasks: _tasks,
        },
        message: "Tasks found successfully for team",
    });
};

exports.getAllTasks = async (req, res) => {
    const { userToken } = req.body;

    const decoded = decodeToken(userToken);
    const unlockedUser = unlockUserAddress(decoded);

    const txReceipt = await sendSignedMetaTransaction(Tasks, unlockedUser.address, unlockedUser.secret, {
        gas: Web3Config.transaction.gas.high,
    }, "getTaskIds");
    const logs = await processEventLogs(Tasks, txReceipt.logs);

    const _tasks = logs.filter((log) => log.name === "Op_TaskIds").map((log) => log.data["_taskIds"])[0];

    // const _taskWithTeams = _tasks.map(async (taskId) => {
    //     const _txReceipt = await sendSignedMetaTransaction(Tasks, unlockedUser.address, unlockedUser.secret, {
    //         gas: Web3Config.transaction.gas.high,
    //     }, "getTaskWithTeams", taskId);
    //     const _logs = await processEventLogs(Tasks, _txReceipt.logs);
    //     const _teams = _logs.filter((log) => log.name === "Op_TaskWithTeams").map((log) => log.data["_teamIds"])[0];
    //     return {
    //         task: taskId,
    //         teams: _teams,
    //     };
    // });

    let _taskWithTeams = [];
    for (const _task of _tasks) {
        const _tx = await sendSignedMetaTransaction(Tasks, unlockedUser.address, unlockedUser.secret, {
            gas: Web3Config.transaction.gas.high,
        }, "getTaskWithTeams", _task);
        const _logs = await processEventLogs(Tasks, _tx.logs);
        const _teams = _logs.filter((log) => log.name === "Op_TaskWithTeams").map((log) => log.data["_teamIds"])[0];

        _taskWithTeams = _tasks.map((task) => {
            return {
                task: task,
                teams: _teams,
            };
        });
    }

    return res.json({
        data: {
            tasks: _taskWithTeams,
        },
        message: "All tasks found successfully",
    });
};

exports.assign = async (req, res) => {
    if (isRequestEmpty(req)) {
        return res.status(400).json({
            message: "Request body is empty",
        });
    }

    const { task, tasks, team, teams, userToken } = req.body;

    const decoded = decodeToken(userToken);
    const unlockedUser = unlockUserAddress(decoded);

    if (task && teams) {
        const txReceipt = await sendSignedMetaTransaction(Tasks, unlockedUser.address, unlockedUser.secret, {
            gas: Web3Config.transaction.gas.high,
        }, "assignTaskToTeams", task, teams);
        const logs = await processEventLogs(Tasks, txReceipt.logs);

        const txReceiptGetTeams = await sendSignedMetaTransaction(Tasks, unlockedUser.address, unlockedUser.secret, {
            gas: Web3Config.transaction.gas.high,
        }, "getTaskWithTeams", task);
        const logsGetTeams = await processEventLogs(Tasks, txReceiptGetTeams.logs);
        const _teams = logsGetTeams.filter((log) => log.name === "Op_TaskWithTeams").map((log) => log.data["_teamIds"])[0];

        res.json({
            data: {
                task,
                teams: _teams,
            },
            message: "Task assigned successfully",
        });
    }

    if (tasks && team) {
        const txReceipt = await sendSignedMetaTransaction(Tasks, unlockedUser.address, unlockedUser.secret, {
            gas: Web3Config.transaction.gas.high,
        }, "assignTasksToTeam", tasks, team);
        const logs = await processEventLogs(Tasks, txReceipt.logs);

        const txReceiptGetTasks = await sendSignedMetaTransaction(Tasks, unlockedUser.address, unlockedUser.secret, {
            gas: Web3Config.transaction.gas.high,
        }, "getTeamWithTasks", team);
        const logsGetTasks = await processEventLogs(Tasks, txReceiptGetTasks.logs);
        const _tasks = logsGetTasks.filter((log) => log.name === "Op_TeamWithTasks").map((log) => log.data["_taskIds"])[0];

        res.json({
            data: {
                team: team,
                tasks: _tasks,
            },
            message: "Task assigned successfully",
        });
    }
};

exports.unassign = async (req, res) => {

};