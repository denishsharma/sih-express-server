const { Tasks } = require("../../app/contracts");
const { processEventLogs, sendSignedMetaTransaction, createLockedAccount } =  require("../../app/utils/wallet.utils")
const { parseToJSONObject } = require("../../app/utils/general.utils")

const publicKey = process.env.SEED_ACCOUNT_ADDRESS;
const privateKey = process.env.SEED_ACCOUNT_PRIVATE;

const createTask = async () => {
    const TxReceipt = await sendSignedMetaTransaction(Tasks, publicKey, privateKey, {}, "createTask", "abhijeet");
    const logs = await processEventLogs(Tasks, TxReceipt.logs);

    const _task = logs.filter((log) => log.name === "TaskCreated").map((log) => log.data);
    console.log(_task);
}

const addTaskToTeam = async () => {
    const TxReceipt = await sendSignedMetaTransaction(Tasks, publicKey, privateKey, {}, "addTaskToTeam", "abcd", "team1");
    const logs = await processEventLogs(Tasks, TxReceipt.logs);

    const _taskToTeam = logs.filter((log) => log.name === "TaskAdded").map((log) => log.data);
    console.log(_taskToTeam);
}

const addTasksToTeam = async () => {
    const TxReceipt = await sendSignedMetaTransaction(Tasks, publicKey, privateKey, {}, "addTasksToTeam", "team2", ["mtask1", "mtask2"]);
    const logs = await processEventLogs(Tasks, TxReceipt.logs);

    const _tasksToTeam = logs.filter((log) => log.name === "TaskAdded").map((log) => log.data);
    console.log(_tasksToTeam);
}

const addTaskToTeams = async () => {
    const TxReceipt = await sendSignedMetaTransaction(Tasks, publicKey, privateKey, {}, "addTaskToTeams", "jbsdg", ["mteam1", "mteam2"]);
    const logs = await processEventLogs(Tasks, TxReceipt.logs);

    const _taskToTeams = logs.filter((log) => log.name === "TaskAdded").map((log) => log.data);
    console.log(_taskToTeams);
}

const removeTaskFromTeam = async () => {
    const TxReceipt = await sendSignedMetaTransaction(Tasks, publicKey, privateKey, {}, "removeTaskFromTeam", "abcd", "team1");
    const logs = await processEventLogs(Tasks, TxReceipt.logs);

    const _taskToTeam = logs.filter((log) => log.name === "TaskRemoved").map((log) => log.data);
    console.log(_taskToTeam);
}

const removeTaskFromTeams = async () => {
    const TxReceipt = await sendSignedMetaTransaction(Tasks, publicKey, privateKey, {}, "removeTaskFromTeams", "jbsdg", ["mteam1", "mteam2"]);
    const logs = await processEventLogs(Tasks, TxReceipt.logs);

    const _taskToTeams = logs.filter((log) => log.name === "TaskRemoved").map((log) => log.data);
    console.log(_taskToTeams);
}

const removeTasksFromTeam = async () => {
    const TxReceipt = await sendSignedMetaTransaction(Tasks, publicKey, privateKey, {}, "removeTasksFromTeam", "team2", ["mtask1", "mtask2"]);
    const logs = await processEventLogs(Tasks, TxReceipt.logs);

    const _tasksToTeam = logs.filter((log) => log.name === "TaskRemoved").map((log) => log.data);
    console.log(_tasksToTeam);
}

const getTeams = async () => {
    const TxReceipt = await sendSignedMetaTransaction(Tasks, publicKey, privateKey, {}, "getTeams", "abcd");
    const logs = await processEventLogs(Tasks, TxReceipt.logs);

    const _teams = logs.filter((log) => log.name === "Op_getTeams").map((log) => log.data);
    console.log(_teams);
}

const getTasks = async () => {
    const TxReceipt = await sendSignedMetaTransaction(Tasks, publicKey, privateKey, {}, "getTasks", "team1");
    const logs = await processEventLogs(Tasks, TxReceipt.logs);

    const _tasks = logs.filter((log) => log.name === "Op_getTasks").map((log) => log.data);
    console.log(_tasks);
}

exports.test = async () => {
    // await createTask();
    // await addTaskToTeam();
    // await addTasksToTeam();
    // await addTaskToTeams();
    // await removeTaskFromTeam();
    // await removeTaskFromTeams();
    // await removeTasksFromTeam();
    // await getTeams();
    // await getTasks();
}

exports.metadata = {
    name: "tasks",
}