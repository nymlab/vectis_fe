import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { Coin, OfflineSigner } from "@cosmjs/proto-signing";
import { GasPrice } from "@cosmjs/stargate";
import { NetworkOptions } from "interfaces/network";
import networks from "configs/networks";

export const createSignCosmWasmClient = async (signer: OfflineSigner, networkOption: NetworkOptions): Promise<SigningCosmWasmClient> => {
  const network = networks[networkOption];
  return await SigningCosmWasmClient.connectWithSigner(network.rpcUrl, signer, {
    prefix: network.addressPrefix,
    gasPrice: GasPrice.fromString(`${network.gasPrice}${network.feeToken}`),
  });
};

export const getNativeBalance = async (signCosmWasmClient: SigningCosmWasmClient, address: string, denom: string): Promise<Coin> => {
  return await signCosmWasmClient.getBalance(address, denom);
};
