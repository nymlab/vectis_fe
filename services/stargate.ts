import {
  BankExtension,
  GasPrice,
  QueryClient,
  setupBankExtension,
  setupStakingExtension,
  StakingExtension,
  setupTxExtension,
  TxExtension,
} from "@cosmjs/stargate";
import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { Coin, OfflineSigner } from "@cosmjs/proto-signing";
import { Tendermint34Client } from "@cosmjs/tendermint-rpc";
import network from "configs/networks";

export const createSignCosmWasmClient = async (signer: OfflineSigner): Promise<SigningCosmWasmClient> => {
  return await SigningCosmWasmClient.connectWithSigner(network.rpcUrl, signer, {
    prefix: network.addressPrefix,
    gasPrice: GasPrice.fromString(`${network.gasPrice}${network.feeToken}`),
  });
};

export const createTendermintClient = async (): Promise<Tendermint34Client> => {
  return await Tendermint34Client.connect(network.rpcUrl);
};

export const createQueryClient = async (): Promise<QueryClient & StakingExtension & BankExtension & TxExtension> => {
  const tmClient = await createTendermintClient();
  return QueryClient.withExtensions(tmClient, setupStakingExtension, setupBankExtension, setupTxExtension);
};

export const getNativeBalance = async (signCosmWasmClient: SigningCosmWasmClient, address: string, denom: string): Promise<Coin> => {
  return await signCosmWasmClient.getBalance(address, denom);
};
