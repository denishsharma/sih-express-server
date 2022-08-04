const Web3 = require("web3");
let networkProvider = "ws://localhost:7545";

let web3Provider = new Web3.providers.WebsocketProvider(networkProvider);
web3 = new Web3(web3Provider);

const AddNumbers = require("../../app/contracts/deployed/AddNumbers.deployed")(web3, 5777);

const subscribedEvents = {};
const events = {};

const subscribeLogEvent = (eventName) => {
    const eventJsonInterface = SimpleStorage._jsonInterface.filter((item) => item.name === eventName && item.type === "event")[0];
    subscribedEvents[eventName] = web3.eth.subscribe("logs", {
        address: SimpleStorage.options.address,
        topics: [eventJsonInterface.signature],
    }, (error, result) => {
        if (!error) {
            const eventObj = web3.eth.abi.decodeLog(eventJsonInterface.inputs, result.data, result.topics.slice(1));
            console.log(`${eventName} event`, eventObj);
        }
    });

    console.log(`subscribed to event '${eventName}' of contract '${SimpleStorage._contractName}' `);
};


(async () => {
    // const pastEvents = await SimpleStorage.getPastEvents('numberChanged', {
    //     fromBlock: 0,
    //     toBlock: 'latest'
    // });

    // console.log(pastEvents);

    const eventsInterface = AddNumbers._jsonInterface.filter((item) => item.type === "event");

    const eventObjects = {};

    for (let eventInterface in eventsInterface) {
        eventInterface = eventsInterface[eventInterface];

        const eventObject = {
            name: eventInterface.name,
            signature: eventInterface.signature,
            inputs: eventInterface.inputs,
        };

        eventObject.subscribe = (handler) => {
            console.log(`subscribed to event '${eventObject.name}' of contract '${AddNumbers._contractName}' `);
        };

        eventObject.unsubscribe = () => {
            console.log(`unsubscribed from event '${eventObject.name}' of contract '${AddNumbers._contractName}' `);
        };

        eventObjects[eventInterface.name] = eventObject;
    }


    eventObjects["numberAdded"].subscribe();

    // await SimpleStorage.events.numberChanged({}).on('data', (event) => console.log(event));

    // SimpleStorage.events.allEvents({}, (error, result) => {
    //     console.log(result)
    // });

})();

// SimpleStorage.events.allEvents({}, (error, event) => {
//     console.log(event);
// });
// SimpleStorage.events.numberChanged({}).on('data', (event) => console.log(event));