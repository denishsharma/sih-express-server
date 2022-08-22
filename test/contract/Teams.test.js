const { Teams } = require("../../app/contracts");
const { processEventLogs, sendSignedMetaTransaction } = require("../../app/utils/wallet.utils");

const publicKey = process.env.SEED_ACCOUNT_ADDRESS;
const privateKey = process.env.SEED_ACCOUNT_PRIVATE;

const testCreateTeam = async () => {
    const txReceipt = await sendSignedMetaTransaction(Teams, publicKey, privateKey, {}, "createTeam", "team1");
    const logs = await processEventLogs(Teams, txReceipt.logs);
    logs.filter((log) => log.name === "TeamCreated").map((log) => {
        console.log(log.data);
    });
};

const testGetTeamIds = async () => {
    const txReceipt = await sendSignedMetaTransaction(Teams, publicKey, privateKey, {}, "getTeamIds");
    const logs = await processEventLogs(Teams, txReceipt.logs);
    logs.filter((log) => log.name === "Op_TeamIds").map((log) => {
        console.log(log.data);
    });
};

const testGetTaskIds = async () => {
    const txReceipt = await sendSignedMetaTransaction(Teams, publicKey, privateKey, {}, "getTaskIds");
    const logs = await processEventLogs(Teams, txReceipt.logs);
    logs.filter((log) => log.name === "Op_TaskIds").map((log) => {
        console.log(log.data);
    });
};

const testGetTeamMemberAddresses = async () => {
    const txReceipt = await sendSignedMetaTransaction(Teams, publicKey, privateKey, {}, "getTeamMemberAddresses");
    const logs = await processEventLogs(Teams, txReceipt.logs);
    logs.filter((log) => log.name === "Op_TeamMembers").map((log) => {
        console.log(log.data);
    });
};

const testAssignTaskToTeams = async () => {
    const inputs = {
        task: "task2",
        teams: ["team1", "team2", "team3"],
    };
    const txReceipt = await sendSignedMetaTransaction(Teams, publicKey, privateKey, {}, "assignTaskToTeams", inputs.task, inputs.teams);
    const logs = await processEventLogs(Teams, txReceipt.logs);
    logs.filter((log) => log.name === "TaskAssigned").map((log) => {
        console.log(log.data);
    });
};

const testAssignTasksToTeam = async () => {
    const inputs = {
        tasks: ["task8", "task9", "task10"],
        team: "team2",
    };
    const txReceipt = await sendSignedMetaTransaction(Teams, publicKey, privateKey, {}, "assignTasksToTeam", inputs.tasks, inputs.team);
    const logs = await processEventLogs(Teams, txReceipt.logs);
    console.log(logs.filter((log) => log.name === "TaskAssigned").map((log) => log.data["_taskId"]));
};

const testGetTasksFromTeam = async () => {
    const txReceipt = await sendSignedMetaTransaction(Teams, publicKey, privateKey, {}, "getTasksFromTeam", "team4");
    const logs = await processEventLogs(Teams, txReceipt.logs);
    logs.filter((log) => log.name === "Op_TaskIds").map((log) => {
        console.log(log.data);
    });
};

const testAddMemberToTeams = async () => {
    const inputs = {
        member: "0x0d1d4e623D10F9FBA5Db95830F7d3839406C6AF2",
        teams: ["team1", "team2", "team3"],
    };
    const txReceipt = await sendSignedMetaTransaction(Teams, publicKey, privateKey, {}, "addMemberToTeams", inputs.member, inputs.teams);
    const logs = await processEventLogs(Teams, txReceipt.logs);
    logs.filter((log) => log.name === "TeamMemberAdded").map((log) => {
        console.log(log.data);
    });
};

const testAddMembersToTeam = async () => {
    const inputs = {
        members: ["0x0d1d4e623D10F9FBA5Db95830F7d3839406C6AF2", "0x47e92444bC631Cb11123aE6d26bC953E712840a8"],
        team: "team4",
    };
    const txReceipt = await sendSignedMetaTransaction(Teams, publicKey, privateKey, {}, "addMembersToTeam", inputs.members, inputs.team);
    const logs = await processEventLogs(Teams, txReceipt.logs);
    logs.filter((log) => log.name === "TeamMemberAdded").map((log) => {
        console.log(log.data);
    });
};

exports.test = async () => {
    // await testCreateTeam();
    // await testAssignTaskToTeams();
    await testAssignTasksToTeam();
    // await testGetTasksFromTeam();
    // await testAddMemberToTeams();
    // await testAddMembersToTeam();
    // await testGetTeamIds();
    // await testGetTaskIds();
    // await testGetTeamMemberAddresses();

    process.exit();
};

exports.metadata = {
    name: "teams",
};