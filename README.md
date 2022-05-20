# Vectis DApp

## Getting started

This project is based on [Cosmos Contracts Starter Kit](https://github.com/CosmosContracts/starter-kit) and heavily modified.

### 1. Launch local Juno node

When developing this dApp locally, we always connect with a local [Juno](https://www.junonetwork.io/) node running on the same machine, with deployed contracts. In order to setup the local environment, follow these steps:

```bash
git clone https://github.com/nymlab/vectis.git
cd vectis
./local-juno-setup.sh
```

Assuming you have [Docker](https://www.docker.com) and [Rust](https://rustup.rs) installed on your machine, a local Juno node with deployed Vectis contracts will be running in a container with name `juno-local-node`, exposing TCP ports 26656-26657 (Tendermint RPC) and 1317 (REST).

### 2. Launch Vectis DApp locally

First of all, clone this project, then install dependencies:

```bash
git clone https://github.com/nymlab/vectis_fe.git
cd vectis_fe
yarn install # This project uses yarn.lock
```

Next, setup your `.env` file by copying the example:

```bash
cp .env.example .env.local
```

By editing `.env.local`, you tell Vectis which chain it should use with Keplr. It can be a local node, testnet or mainnet, you decide. When developing, we always use local node.

Then, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the dApp running locally.

More information can be found [in the Juno docs here](https://docs.junonetwork.io/smart-contracts-and-junod-development/junod-local-dev-setup).

Please ensure you have the [Keplr wallet extension](https://chrome.google.com/webstore/detail/keplr/dmkamcknogkgcdfhhbddcghachkejeap) installed in your Chrome based browser (Chrome, Brave, etc).

## Learn More

To learn more about Next.js, CosmJS, Keplr, and Tailwind CSS - take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
- [CosmJS Repository](https://github.com/cosmos/cosmjs) - JavaScript library for Cosmos ecosystem.
- [@cosmjs/cosmwasm-stargate Documentation](https://cosmos.github.io/cosmjs/latest/cosmwasm-stargate/modules.html) - CosmJS CosmWasm Stargate module documentation.
- [Keplr Wallet Documentation](https://docs.keplr.app/api/cosmjs.html) - using Keplr wallet with CosmJS.
- [Tailwind CSS Documentation](https://tailwindcss.com/docs) - utility-first CSS framework.
- [DaisyUI Documentation](https://daisyui.com/docs/use) - lightweight component library built on [tailwindcss](https://tailwindcss.com/).
