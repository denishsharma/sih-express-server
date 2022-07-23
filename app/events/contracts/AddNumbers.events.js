const subscribedEvents = require('../events.subscription');

const { AddNumbers } = require("../../contracts");
const { getEvents } = require("../../utils/contract.utils");

const events = getEvents(AddNumbers, subscribedEvents);

module.exports = events;