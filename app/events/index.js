const subscribedEvents = require("./events.subscription");

// Import Events
const SimpleStorageEvents = require("./contracts/SimpleStorage.events");
const AddNumbersEvents = require("./contracts/AddNumbers.events");
const VolunteerProfileEvents = require("./contracts/VolunteerProfile.events");

// Import Event Handlers
const SimpleStorageEventHandlers = require("./handlers/SimpleStorage.events.handler");
const AddNumbersEventHandlers = require("./handlers/AddNumbers.events.handler");
const VolunteerProfileEventHandlers = require("./handlers/VolunteerProfile.events.handler");

const listen = () => {
    // Subscribe or Listen to events
    SimpleStorageEvents["numberChanged"].subscribe({}, SimpleStorageEventHandlers.handleFavoriteNumber);

    AddNumbersEvents["numberAdded"].subscribe({}, AddNumbersEventHandlers.numberAdded);
    AddNumbersEvents["numberUpdated"].subscribe({}, AddNumbersEventHandlers.numberUpdated);

    VolunteerProfileEvents["profileAdded"].subscribe({}, VolunteerProfileEventHandlers.profileAdded);
    VolunteerProfileEvents["profileUpdated"].subscribe({}, VolunteerProfileEventHandlers.profileUpdated);
    VolunteerProfileEvents["editorAccessUpdated"].subscribe({}, VolunteerProfileEventHandlers.editorAccessUpdated);
};

module.exports = {
    subscribedEvents,
    listen,
};