const { Teams } = require("../contracts");
const { processEventLogs, sendSignedMetaTransaction } = require("../utils/wallet.utils");
const { decodeToken } = require("../utils/jwt.utils");
const { unlockUserAddress } = require("../utils/secure.utils");
const Web3Config = require("../configs/web3.config");

const _getTeamsFromTask = async (task, address, secret) => {
    const txReceiptGetTeams = await sendSignedMetaTransaction(Teams, address, secret, {
        gas: Web3Config.transaction.gas.high,
    }, "getTeamsFromTask", task);
    const logsGetTeams = await processEventLogs(Teams, txReceiptGetTeams.logs);
    return logsGetTeams.filter((log) => log.name === "Op_TeamIds").map((log) => log.data["_teamIds"])[0];
};

const _getTasksFromTeam = async (team, address, secret) => {
    const txReceiptGetTasks = await sendSignedMetaTransaction(Teams, address, secret, {
        gas: Web3Config.transaction.gas.high,
    }, "getTasksFromTeam", team);
    const logsGetTasks = await processEventLogs(Teams, txReceiptGetTasks.logs);
    return logsGetTasks.filter((log) => log.name === "Op_TaskIds").map((log) => log.data["_taskIds"])[0];
};

const _getTeamsFromMember = async (user, address, secret) => {
    const txReceiptGetTeams = await sendSignedMetaTransaction(Teams, address, secret, {
        gas: Web3Config.transaction.gas.high,
    }, "getTeamsFromMember", user);
    const logsGetTeams = await processEventLogs(Teams, txReceiptGetTeams.logs);
    return logsGetTeams.filter((log) => log.name === "Op_TeamIds").map((log) => log.data["_teamIds"])[0];
}

const _getMembersFromTeam = async (team, address, secret) => {
    const txReceiptGetUsers = await sendSignedMetaTransaction(Teams, address, secret, {
        gas: Web3Config.transaction.gas.high,
    }, "getMembersFromTeam", team);
    const logsGetUsers = await processEventLogs(Teams, txReceiptGetUsers.logs);
    return logsGetUsers.filter((log) => log.name === "Op_TeamMembers").map((log) => log.data["_teamMembers"])[0];
}

exports.create = async (req, res) => {
    const { team, tasks, users, userToken } = req.body;

    const decoded = decodeToken(userToken);
    const unlockedUser = unlockUserAddress(decoded);

    if (!team) {
        return res.status(400).json({
            message: "Team id is required",
        });
    }

    const output = {};

    if (!tasks && !users) {
        const _txReceipt = await sendSignedMetaTransaction(Teams, unlockedUser.address, unlockedUser.secret, {
            gas: Web3Config.transaction.gas.high,
        }, "createTeam", team);
        const _logs = await processEventLogs(Teams, _txReceipt.logs);
        output.teamId = _logs.filter((log) => log.name === "TeamCreated").map((log) => log.data["_teamId"]);
    }

    if (tasks) {
        const _txReceipt = await sendSignedMetaTransaction(Teams, unlockedUser.address, unlockedUser.secret, {
            gas: Web3Config.transaction.gas.high,
        }, "assignTasksToTeam", tasks, team);
        const _logs = await processEventLogs(Teams, _txReceipt.logs);
        output.teamId = _logs.filter((log) => log.name === "TaskAssigned").map((log) => log.data["_teamId"])[0];
        output.tasks = _logs.filter((log) => log.name === "TaskAssigned").map((log) => log.data["_taskId"]);
    }

    if (users) {
        const txReceipt = await sendSignedMetaTransaction(Teams, unlockedUser.address, unlockedUser.secret, {
            gas: Web3Config.transaction.gas.high,
        }, "addMembersToTeam", users, team);
        const logs = await processEventLogs(Teams, txReceipt.logs);
        output.teamId = logs.filter((log) => log.name === "TeamMemberAdded").map((log) => log.data["_teamId"])[0];
        output.users = logs.filter((log) => log.name === "TeamMemberAdded").map((log) => log.data["_memberAddress"]);
    }

    return res.json({
        data: {
            ...output,
        },
        message: "Team created successfully",
    });
};

exports.getUsers = async (req, res) => {
    const { teamId } = req.params;
    const { userToken } = req.body;

    const decoded = decodeToken(userToken);
    const unlockedUser = unlockUserAddress(decoded);

    const txReceipt = await sendSignedMetaTransaction(Teams, unlockedUser.address, unlockedUser.secret, {
        gas: Web3Config.transaction.gas.high,
    }, "getMembersFromTeam", teamId);
    const logs = await processEventLogs(Teams, txReceipt.logs);
    const users = logs.filter((log) => log.name === "Op_TeamMembers").map((log) => log.data["_teamMembers"])[0];

    return res.json({
        data: {
            teamId,
            users,
        },
        message: "Users retrieved successfully",
    });
};

exports.getTasks = async (req, res) => {
    const { teamId } = req.params;
    const { userToken } = req.body;

    const decoded = decodeToken(userToken);
    const unlockedUser = unlockUserAddress(decoded);

    const txReceipt = await sendSignedMetaTransaction(Teams, unlockedUser.address, unlockedUser.secret, {
        gas: Web3Config.transaction.gas.high,
    }, "getTasksFromTeam", teamId);
    const logs = await processEventLogs(Teams, txReceipt.logs);
    const tasks = logs.filter((log) => log.name === "Op_TaskIds").map((log) => log.data["_taskIds"])[0];

    return res.json({
        data: {
            teamId,
            tasks,
        },
        message: "Tasks retrieved successfully",
    });
};

exports.assignTask = async (req, res) => {
    const { team, teams, task, tasks, userToken } = req.body;

    const decoded = decodeToken(userToken);
    const unlockedUser = unlockUserAddress(decoded);

    if (task && teams) {
        await sendSignedMetaTransaction(Teams, unlockedUser.address, unlockedUser.secret, {
            gas: Web3Config.transaction.gas.high,
        }, "assignTaskToTeams", task, teams);

        const _teams = await _getTeamsFromTask(task, unlockedUser.address, unlockedUser.secret);

        res.json({
            data: {
                task,
                team: _teams,
            },
            message: "Task assigned successfully",
        });
        return;
    }

    if (team && tasks) {
        await sendSignedMetaTransaction(Teams, unlockedUser.address, unlockedUser.secret, {
            gas: Web3Config.transaction.gas.high,
        }, "assignTasksToTeam", tasks, team);

        const _tasks = await _getTasksFromTeam(team, unlockedUser.address, unlockedUser.secret);

        res.json({
            data: {
                team,
                tasks: _tasks,
            },
            message: "Tasks assigned successfully",
        });
    }
};

exports.assignUser = async (req, res) => {
    const { team, teams, user, users, userToken } = req.body;

    const decoded = decodeToken(userToken);
    const unlockedUser = unlockUserAddress(decoded);

    if (user && teams) {
        await sendSignedMetaTransaction(Teams, unlockedUser.address, unlockedUser.secret, {
            gas: Web3Config.transaction.gas.high,
        }, "addMemberToTeams", user, teams);
        const _teams = await _getTeamsFromMember(user, unlockedUser.address, unlockedUser.secret);

        res.json({
            data: {
                user,
                teams: _teams,
            },
            message: "User assigned successfully",
        });
        return;
    }

    if (team && users) {
        const _users = await _getMembersFromTeam(team, unlockedUser.address, unlockedUser.secret);

        res.json({
            data: {
                team,
                users: _users,
            },
            message: "Users assigned successfully",
        });
    }
};

exports.unassignTask = async (req, res) => {
    const { team, teams, task, tasks, userToken } = req.body;

    const decoded = decodeToken(userToken);
    const unlockedUser = unlockUserAddress(decoded);

    if (task && teams) {
        await sendSignedMetaTransaction(Teams, unlockedUser.address, unlockedUser.secret, {
            gas: Web3Config.transaction.gas.high,
        }, "unassignTaskFromTeams", task, teams);

        const _teams = await _getTeamsFromTask(task, unlockedUser.address, unlockedUser.secret);

        res.json({
            data: {
                task,
                team: _teams,
            },
            message: "Task assigned successfully",
        });
        return;
    }

    if (team && tasks) {
        await sendSignedMetaTransaction(Teams, unlockedUser.address, unlockedUser.secret, {
            gas: Web3Config.transaction.gas.high,
        }, "unassignTasksFromTeam", tasks, team);

        const _tasks = await _getTasksFromTeam(team, unlockedUser.address, unlockedUser.secret);

        res.json({
            data: {
                team,
                tasks: _tasks,
            },
            message: "Tasks assigned successfully",
        });
    }
};

exports.unassignUser = async (req, res) => {
    const { team, teams, user, users, userToken } = req.body;

    const decoded = decodeToken(userToken);
    const unlockedUser = unlockUserAddress(decoded);

    if (user && teams) {
        await sendSignedMetaTransaction(Teams, unlockedUser.address, unlockedUser.secret, {
            gas: Web3Config.transaction.gas.high,
        }, 'removeMemberFromTeams', user, teams);
        const _teams = await _getTeamsFromMember(user, unlockedUser.address, unlockedUser.secret);

        res.json({
            data: {
                user,
                teams: _teams,
            },
            message: "Team unassigned successfully",
        });
    }

    if (team && users) {
        await sendSignedMetaTransaction(Teams, unlockedUser.address, unlockedUser.secret, {
            gas: Web3Config.transaction.gas.high,
        }, 'removeMembersFromTeam', users, team);
        const _users = await _getMembersFromTeam(team, unlockedUser.address, unlockedUser.secret);

        res.json({
            data: {
                team,
                users: _users,
            },
            message: "Users unassigned successfully",
        });
    }
};