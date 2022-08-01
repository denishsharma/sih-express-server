## SIH Express Server (Vipdasarathi)

This server is responsible to manage all the blockchain data. With backend server for blockchain, it is cutting out the
dependency of using MetaMask for the transactions. This express app serves the Laravel server in following way:

- manage the data of blockchain
- manage all the transactions of the blockchain
- track and trace the events and changes made in the blockchain
- manage the users (accounts) of the blockchain

## Requirements

* Node JS
* Truffle 5
* Ganache or Private Ethereum Network (Geth)

## Common setup

Clone the repo and install the dependencies.

```bash
git clone https://github.com/denishsharma/sih-express-server.git
cd sih-express-server
```

```bash
npm install
```

## Steps to run the server properly

To start the express server, make sure you have MySQL installed and configured. Also Ganahce or Geth is running.

```bash
cp .env.local .env
```

Open `.env` and make the following changes.

```dotenv
# Change the seed account address and private key to your account on Ganache or Geth
SEED_ACCOUNT_ADDRESS=your_account_public_address
SEED_ACCOUNT_PRIVATE=your_account_private_key
```

```dotenv
# Change the network port number to your running port number
DEV_NETWORK_PORT=your_ganache_running_port_number
```

Sync the database and migrate the tables.

```bash
npm run resync:force
```

Seed the database with the data.

```bash
npm run db:seed
```

Migrate the contracts and deploy the contracts.

```bash
npm run contract:migrate:all
```

Start the server.

```bash
npm run server
```

Open [http://localhost:3000](http://localhost:3000) and take a look around.