# Vectis DApp

## Getting started

This project is based on [Cosmos Contracts Starter Kit](https://github.com/CosmosContracts/starter-kit) and heavily modified.

### 1. Launch Development Node

When developing this dApp locally, we always connect with vectis image which runs [Juno](https://www.junonetwork.io/) under the hood.

Assuming you have [Docker](https://www.docker.com) installed on your machine, a local Juno node with deployed Vectis contracts will be running in a container with name `vectis_node`, exposing TCP ports 26656-26657 (Tendermint RPC) and 1317 (REST).

In order to setup the development environment, follow these steps:

##### 1. Run vectis image

```bash
docker run -d --name vectis_node -p 1317:1317 -p 26656:26656 -p 26657:26657 ghcr.io/nymlab/vectis:main
```

##### 2. Extract factory address

```bash
docker exec -it vectis_node cat .cache/uploadInfo.json | grep '"factoryAddr":' | cut -c19-81
```

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

> **Note:** _Regardless of the network you use, you must set NEXT_PUBLIC_CONTRACT_FACTORY_ADDRESS_

**it is important to ensure that you are providing a valid factory contract address.**

Doing so is easy, just copy one of the addresses you got from the terminal and put it inside `.env.local` under the `NEXT_PUBLIC_CONTRACT_FACTORY_ADDRESS` key. Please **do not modify `.env.example`** as that's just a blueprint for environment variables.

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
