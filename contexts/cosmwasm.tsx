import React, { createContext, useContext, PropsWithChildren, useState, useEffect, useCallback } from "react";
import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { connectKeplr, getKey, getSigner } from "services/keplr";
import { createSignCosmWasmClient } from "services/cosmwasm";
import { deleteWalletAddress, setWalletAddress } from "services/localStorage";
import { env } from "env";
import { Key } from "@keplr-wallet/types";
import networks from "configs/networks";
import { Network } from "interfaces/network";
import { Coin } from "@cosmjs/proto-signing";

export interface ICosmWasmContext {
  address: string;
  keyDetails: Key;
  network: Network;
  signingClient: SigningCosmWasmClient;
  isReady: boolean;
  isLoading: boolean;
  error: unknown;
  getBalance: () => Promise<Coin>;
  connectWallet: () => void;
  disconnect: () => void;
}

const CosmWasmContext = createContext<ICosmWasmContext | null>(null);

export const SigningCosmWasmProvider: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  const [address, setAddress] = useState<string | null>(null);
  const [keyDetails, setKeyDetails] = useState<Key | null>(null);
  const [signingClient, setSigningClient] = useState<SigningCosmWasmClient | null>(null);
  const [network, setNetwork] = useState<Network | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isReady, setIsReady] = useState<boolean>(false);
  const [error, setError] = useState<unknown | null>(null);
  const { networkName } = env;

  useEffect(() => {
    setNetwork(networks[networkName]);
  }, [networkName]);

  const connectWallet = async () => {
    setIsLoading(true);
    try {
      await connectKeplr(networkName);
      const signer = await getSigner(networkName);
      const client = await createSignCosmWasmClient(signer, networkName);
      const key = await getKey(networkName);
      const [{ address: firstAddress }] = await signer.getAccounts();

      setSigningClient(client);
      setKeyDetails(key!);
      setAddress(firstAddress);
      setWalletAddress(firstAddress);
      setIsReady(true);
    } catch (error) {
      setError(error);
    }
    setIsLoading(false);
  };

  const getBalance = useCallback(() => signingClient!.getBalance(address!, network?.feeToken!), [address, network]);

  const disconnect = useCallback(() => {
    setIsLoading(true);
    signingClient?.disconnect();
    deleteWalletAddress();
    setAddress(null);
    setKeyDetails(null);
    setSigningClient(null);
    setIsReady(false);
    setIsLoading(false);
  }, []);

  return (
    <CosmWasmContext.Provider
      value={
        { address, signingClient, isLoading, isReady, keyDetails, network, error, getBalance, connectWallet, disconnect } as ICosmWasmContext
      }
    >
      {children}
    </CosmWasmContext.Provider>
  );
};

export const useCosmWasmClient = (): ICosmWasmContext => {
  const context = useContext(CosmWasmContext);
  if (context === null) {
    throw new Error("useCosmWasmClient must be used within a CosmWasmProvider");
  }
  return context;
};
