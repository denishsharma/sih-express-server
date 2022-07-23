const subscribedEvents = require('../events.subscription');

const { SimpleStorage } = require("../../contracts");
const { getEvents } = require("../../utils/contract.utils");

const events = getEvents(SimpleStorage, subscribedEvents);

module.exports = events;