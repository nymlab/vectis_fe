import { WalletInfoWithBalance } from "contexts/vectis";
import { ProxyClient } from "./../types/ProxyContract";
import { Coin, CreateWalletMsg, FactoryClient } from "./../types/FactoryContract";
import { env } from "env";
import { coin, convertMicroDenomToDenom } from "util/conversion";
import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";

export async function createProxyWallet(
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
    throw new Error(`Signer account was not found by user address ${userAddress}`);
  }

  const factoryClient = new FactoryClient(signingClient, userAddress, env.contractFactoryAddress);

  const defaultWalletCreationFee = await factoryClient.fee();
  const walletFee = convertMicroDenomToDenom(100);

  // Create wallet message
  const createWalletMsg: CreateWalletMsg = {
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

  // Execute wallet creation
  const res = await factoryClient.createWallet(
    { createWalletMsg },
    Number(defaultWalletCreationFee.amount),
    undefined,
    [coin(proxyInitialFunds + walletFee)]
  );

  console.log(`Executed wallet creation transaction with hash ${res.transactionHash}. Logs:`, res.logs);
}

export async function queryProxyWalletsOfUser(
  signingClient: SigningCosmWasmClient,
  userAddress: string
): Promise<string[]> {
  const factoryClient = new FactoryClient(signingClient, userAddress, env.contractFactoryAddress);
  const { wallets } = await factoryClient.walletsOf({ user: userAddress });

  return wallets;
}

export async function queryProxyWalletInfo(
  signingClient: SigningCosmWasmClient,
  userAddress: string,
  proxyWalletAddress: string
): Promise<WalletInfoWithBalance> {
  const proxyClient = new ProxyClient(signingClient, userAddress, proxyWalletAddress);
  const info = await proxyClient.info();
  const balance = await signingClient.getBalance(proxyWalletAddress, env.stakingDenom);

  return {
    ...info,
    balance: balance as Coin,
  };
}

export async function transferFundsFromProxyWallet(
  signingClient: SigningCosmWasmClient,
  fromAddress: string,
  proxyWalletAddress: string,
  toAddress: string,
  amount: number
) {
  const proxyClient = new ProxyClient(signingClient, fromAddress, proxyWalletAddress);

  const res = await proxyClient.execute({
    msgs: [
      {
        bank: {
          send: {
            to_address: toAddress,
            amount: [coin(amount)],
          },
        },
      },
    ],
  });

  console.log(`Executed send funds transaction with hash ${res.transactionHash}. Logs:`, res.logs);
}

export async function toggleProxyWalletFreezeStatus(
  signingClient: SigningCosmWasmClient,
  guardianAddress: string,
  proxyWalletAddress: string
) {
  const proxyClient = new ProxyClient(signingClient, guardianAddress, proxyWalletAddress);
  const res = await proxyClient.revertFreezeStatus();
  console.log(`Executed revert freeze status transaction with hash ${res.transactionHash}. Logs:`, res.logs);
}

export async function rotateUserKey(
  signingClient: SigningCosmWasmClient,
  guardianAddress: string,
  proxyWalletAddress: string,
  newUserAddress: string
) {
  const proxyClient = new ProxyClient(signingClient, guardianAddress, proxyWalletAddress);
  const res = await proxyClient.rotateUserKey({ newUserAddress });
  console.log(`Executed key rotation transaction with hash ${res.transactionHash}. Logs:`, res.logs);
}
