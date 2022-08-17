const subscribedEvents = require("../events.subscription");

const { Records } = require("../../contracts");
const { getEvents } = require("../../utils/contract.utils");

const events = getEvents(Records, subscribedEvents);

module.exports = events;