const subscribedEvents = require("../events.subscription");

const { VolunteerProfile } = require("../../contracts");
const { getEvents } = require("../../utils/contract.utils");

const events = getEvents(VolunteerProfile, subscribedEvents);

module.exports = events;