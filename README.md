# Vectis dApp

## Getting started

This project is based on [Cosmos Contracts Starter Kit](https://github.com/CosmosContracts/starter-kit)

First of all, clone this project, then install dependencies:
```bash
cd vectis_fe
yarn install # This project uses yarn.lock
```

Next, setup your `.env` file by copying the example:

```bash
cp .env.example .env.local
```

By editing `.env.local`, you tell Vectis which chain it should use with Keplr. It can be a local node, testnet or mainnet, you decide.

Then, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

In order to interact with a local chain, the easiest way is with docker:

```sh
docker run -it \
  -p 26656:26656 \
  -p 26657:26657 \
  -e STAKE_TOKEN=ujunox \
  ghcr.io/cosmoscontracts/juno:v2.3.1 \
  ./setup_and_run.sh juno16g2rahf5846rxzp3fwlswy08fz8ccuwk03k57y
```

More information can be found [in the Juno docs here](https://docs.junonetwork.io/smart-contracts-and-junod-development/junod-local-dev-setup).

## Requirements

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
