import { coin } from 'util/conversion'
import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { Coin } from "@cosmjs/stargate";
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
  const account = await signingClient.getAccount(userAddress);
  if (!account) {
    throw new Error(`Signer account was not found by user address ${userAddress}`);
  }

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
}
