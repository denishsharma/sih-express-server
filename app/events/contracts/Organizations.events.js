const subscribedEvents = require("../events.subscription");

const { Organizations } = require("../../contracts");
const { getEvents } = require("../../utils/contract.utils");

const events = getEvents(Organizations, subscribedEvents);

module.exports = events;