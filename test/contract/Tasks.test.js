const { Tasks } = require("../../app/contracts");
const { processEventLogs, sendSignedMetaTransaction } = require("../../app/utils/wallet.utils");

const publicKey = process.env.SEED_ACCOUNT_ADDRESS;
const privateKey = process.env.SEED_ACCOUNT_PRIVATE;

const testCreateTask = async () => {
    const txReceipt = await sendSignedMetaTransaction(Tasks, publicKey, privateKey, {}, "createTask", "task1");
    const logs = await processEventLogs(Tasks, txReceipt.logs);
    logs.filter((log) => log.name === "TaskCreated").map((log) => {
        console.log(log.data);
    });
};

const testAssignTaskToTeams = async () => {
    const inputs = {
        task: "task2",
        teams: ["team1", "team2", "team3"],
    };
    const txReceipt = await sendSignedMetaTransaction(Tasks, publicKey, privateKey, {}, "assignTaskToTeams", inputs.task, inputs.teams);
    const logs = await processEventLogs(Tasks, txReceipt.logs);
    logs.filter((log) => log.name === "TaskAssigned").map((log) => {
        console.log(log.data);
    });
};

const testAssignTasksToTeam = async () => {
    const inputs = {
        tasks: ["task1", "task2", "task3"],
        team: "team4",
    };
    const txReceipt = await sendSignedMetaTransaction(Tasks, publicKey, privateKey, {}, "assignTasksToTeam", inputs.tasks, inputs.team);
    const logs = await processEventLogs(Tasks, txReceipt.logs);
    logs.filter((log) => log.name === "TaskAssigned").map((log) => {
        console.log(log.data);
    }).length;
};

const testGetTaskWithTeams = async () => {
    const txReceipt = await sendSignedMetaTransaction(Tasks, publicKey, privateKey, {}, "getTaskWithTeams", "task1");
    const logs = await processEventLogs(Tasks, txReceipt.logs);
    logs.filter((log) => log.name === "Op_TaskWithTeams").map((log) => {
        console.log(log.data);
    });
};

const testGetTeamWithTasks = async () => {
    const txReceipt = await sendSignedMetaTransaction(Tasks, publicKey, privateKey, {}, "getTeamWithTasks", "team1");
    const logs = await processEventLogs(Tasks, txReceipt.logs);
    logs.filter((log) => log.name === "Op_TeamWithTasks").map((log) => {
        console.log(log.data);
    });
};

const testUnassignTaskFromTeams = async () => {
    const inputs = {
        task: "task2",
        teams: ["team1", "team2"],
    };
    const txReceipt = await sendSignedMetaTransaction(Tasks, publicKey, privateKey, {}, "unassignTaskFromTeams", inputs.task, inputs.teams);
    const logs = await processEventLogs(Tasks, txReceipt.logs);
    logs.filter((log) => log.name === "TaskUnassigned").map((log) => {
        console.log(log.data);
    });
};

const testUnassignTasksFromTeam = async () => {
    const inputs = {
        tasks: ["task1", "task2"],
        team: "team4",
    };
    const txReceipt = await sendSignedMetaTransaction(Tasks, publicKey, privateKey, {}, "unassignTasksFromTeam", inputs.tasks, inputs.team);
    const logs = await processEventLogs(Tasks, txReceipt.logs);
    logs.filter((log) => log.name === "TaskUnassigned").map((log) => {
        console.log(log.data);
    });
};

const testGetAllTask = async () => {
    const txReceipt = await sendSignedMetaTransaction(Tasks, publicKey, privateKey, {}, "getTaskIds");
    const logs = await processEventLogs(Tasks, txReceipt.logs);
    logs.filter((log) => log.name === "Op_TaskIds").map((log) => {
        console.log(log.data);
    });
};

const testGetAllTeam = async () => {
    const txReceipt = await sendSignedMetaTransaction(Tasks, publicKey, privateKey, {}, "getTeamIds");
    const logs = await processEventLogs(Tasks, txReceipt.logs);
    logs.filter((log) => log.name === "Op_TeamIds").map((log) => {
        console.log(log.data);
    });
};

exports.test = async () => {
    // await testCreateTask();
    // await testAssignTaskToTeams();
    // await testAssignTasksToTeam();
    // await testGetTaskWithTeams();
    // await testGetTeamWithTasks();
    // await testUnassignTaskFromTeams();
    // await testUnassignTasksFromTeam();

    // await testGetAllTask();
    // await testGetAllTeam();
    
    process.exit(0);
};

exports.metadata = {
    name: "tasks",
};