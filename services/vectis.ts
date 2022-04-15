import { env } from "env";
import { coin } from "util/conversion";
import { CosmWasmClient, SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { Coin, calculateFee, GasPrice } from "@cosmjs/stargate";
import { toBase64 } from "@cosmjs/encoding";

export interface MultiSig {
  threshold_absolute_count: number;
  multisig_initial_funds: Coin[];
}

export interface CreateWalletMsg {
  user_pubkey: string;
  guardians: {
    addresses: string[];
    guardians_multisig: MultiSig | null;
  };
  relayers: string[];
  proxy_initial_funds: Coin[];
}

export async function createVectisWallet(signingClient: SigningCosmWasmClient, userAddress: string, guardians: string[], relayers: string[], proxyInitialFunds: number) {
  if (!env.contractFactoryAddress) {
    throw new Error("Factory address is missing in environment");
  }

  const account = await signingClient.getAccount(userAddress);
  if (!account) {
    throw new Error(`Signer account was not found by user address ${userAddress}`);
  }

  const defaultWalletCreationFee = calculateFee(500, GasPrice.fromString(env.gasPrice + env.stakingDenom));

  // Setup message
  const walletInitMsg: CreateWalletMsg = {
    user_pubkey: toBase64(account.pubkey?.value),
    guardians: {
      addresses: guardians,
      guardians_multisig: {
        threshold_absolute_count: Math.ceil(guardians.length / 2),
        multisig_initial_funds: [coin(proxyInitialFunds * 0.05)],
      },
    },
    relayers: relayers,
    proxy_initial_funds: [coin(proxyInitialFunds)],
  }

  // Create wallet
  const res = await signingClient.execute(
    userAddress,
    env.contractFactoryAddress,
    { create_wallet: { create_wallet_msg: walletInitMsg } },
    "", defaultWalletCreationFee.amount,
  );

  console.log(`Executed wallet creation transaction with hash ${res.transactionHash}. Logs:`, res.logs);
}

export async function getVectisWalletAddress() {
  const client = await CosmWasmClient.connect(env.chainRpcEndpoint);
  const { wallets } = await client.queryContractSmart(env.contractFactoryAddress, {
    wallets: {},
  });

  return wallets?.[0];
}
