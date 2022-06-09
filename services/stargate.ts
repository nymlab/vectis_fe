import { BankExtension, GasPrice, QueryClient, setupBankExtension, setupStakingExtension, StakingExtension } from "@cosmjs/stargate";
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

export const createQueryClient = async (): Promise<QueryClient & StakingExtension & BankExtension> => {
  const tmClient = await Tendermint34Client.connect(network.rpcUrl);
  return QueryClient.withExtensions(tmClient, setupStakingExtension, setupBankExtension);
};

export const getNativeBalance = async (signCosmWasmClient: SigningCosmWasmClient, address: string, denom: string): Promise<Coin> => {
  return await signCosmWasmClient.getBalance(address, denom);
};
