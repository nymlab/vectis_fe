import { env } from "env";
import { coin, convertMicroDenomToDenom } from "util/conversion";
import {
  CosmWasmClient,
  SigningCosmWasmClient,
} from "@cosmjs/cosmwasm-stargate";
import { Coin, calculateFee, GasPrice } from "@cosmjs/stargate";

export interface MultiSig {
  threshold_absolute_count: number;
  multisig_initial_funds: Coin[];
}

export interface CreateWalletMsg {
  user_pubkey: string;
  guardians: {
    addresses: string[];
    guardians_multisig?: MultiSig;
  };
  relayers: string[];
  proxy_initial_funds: Coin[];
}

export interface WalletInfo {
  balance: Coin;
  code_id: number;
  guardians: string[];
  is_frozen: boolean;
  multisig_address?: string;
  multisig_code_id?: number;
  nonce: number;
  relayers: string[];
  user_addr: string;
  version: {
    contract: string;
    version: string;
  };
}

export async function createVectisWallet(
  signingClient: SigningCosmWasmClient,
  userAddress: string,
  guardians: string[],
  relayers: string[],
  proxyInitialFunds: number,
  multisigThreshold?: number
) {
  if (!env.contractFactoryAddress) {
    throw new Error("Factory address is missing in environment");
  }

  const account = await signingClient.getAccount(userAddress);
  if (!account) {
    throw new Error(
      `Signer account was not found by user address ${userAddress}`
    );
  }

  const defaultWalletCreationFee = calculateFee(
    1_500_000,
    GasPrice.fromString(env.gasPrice + env.stakingDenom)
  );
  const walletFee = convertMicroDenomToDenom(100);

  // Setup message
  const walletInitMsg: CreateWalletMsg = {
    user_pubkey: account.pubkey?.value,
    guardians: {
      addresses: guardians,
      ...(multisigThreshold && {
        guardians_multisig: {
          threshold_absolute_count: multisigThreshold,
          multisig_initial_funds: [],
        },
      }),
    },
    relayers: relayers,
    proxy_initial_funds: [coin(proxyInitialFunds)],
  };

  // Create wallet
  const res = await signingClient.execute(
    userAddress,
    env.contractFactoryAddress,
    { create_wallet: { create_wallet_msg: walletInitMsg } },
    defaultWalletCreationFee,
    undefined,
    [coin(proxyInitialFunds + walletFee)]
  );

  console.log(
    `Executed wallet creation transaction with hash ${res.transactionHash}. Logs:`,
    res.logs
  );
}

export async function queryVectisWalletsOfUser(
  userAddress: string
): Promise<string[]> {
  const client = await CosmWasmClient.connect(env.chainRpcEndpoint);
  const { wallets } = await client.queryContractSmart(
    env.contractFactoryAddress,
    {
      wallets_of: { user: userAddress, start_after: null, limit: null },
    }
  );

  return wallets;
}

export async function queryVectisWalletInfo(
  walletAddress: string
): Promise<WalletInfo> {
  const client = await CosmWasmClient.connect(env.chainRpcEndpoint);
  const info = await client.queryContractSmart(walletAddress, {
    info: {},
  });

  const balance = await client.getBalance(walletAddress, env.stakingDenom);

  return {
    ...info,
    balance,
  };
}
