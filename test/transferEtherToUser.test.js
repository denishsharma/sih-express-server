const Web3 = require("web3");
web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));

(async function () {
    const tx = await web3.eth.accounts.signTransaction({
        from: '0x81961914f9497F25b725aC5780468FD9322ED31a',
        to: '0x5225b8d389E797Fea89f3dF2708CB1Be8Cf185F0',
        value: '2000000000000000000',
        gas: '21000',
    }, 'cc4fac40c5e0f3eb6e722d482cfc6f9407e4d14f1b3d6ecde2811c0c56d38b4f');

    const rx = await web3.eth.sendSignedTransaction(tx.rawTransaction);
    console.log('Success full transaction: ' + tx.transactionHash);
})();