import React, { createContext, useContext, PropsWithChildren, useState, useEffect, useCallback } from "react";
import { BankExtension, StakingExtension, QueryClient, TxExtension, DistributionExtension } from "@cosmjs/stargate";
import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { connectKeplr, getKey, getSigner } from "services/keplr";
import { createQueryClient, createSignCosmWasmClient, createTendermintClient } from "services/stargate";
import { deleteSession, setSession, getSession } from "services/localStorage";
import networkConfig from "configs/networks";
import { Network } from "interfaces/network";
import { Coin } from "@cosmjs/proto-signing";
import { Key } from "@keplr-wallet/types";
import { Tendermint34Client } from "@cosmjs/tendermint-rpc";
import { encodeSecp256k1Pubkey, Secp256k1Pubkey } from "@cosmjs/amino";

export interface ICosmWasmContext {
  address: string;
  pubkey: Secp256k1Pubkey;
  keyDetails: Key;
  network: Network;
  queryClient: QueryClient & StakingExtension & BankExtension & TxExtension & DistributionExtension;
  tmClient: Tendermint34Client;
  signingClient: SigningCosmWasmClient;
  isReady: boolean;
  isLoading: boolean;
  error: Error | null;
  getBalance: (addr: string) => Promise<Coin>;
  connectWallet: () => void;
  disconnect: () => void;
}

const CosmWasmContext = createContext<ICosmWasmContext | null>(null);

export const SigningCosmWasmProvider: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  const [address, setAddress] = useState<string | null>(null);
  const [keyDetails, setKeyDetails] = useState<Key | null>(null);
  const [pubkey, setPubkey] = useState<Secp256k1Pubkey | null>(null);
  const [signingClient, setSigningClient] = useState<SigningCosmWasmClient | null>(null);
  const [queryClient, setQueryClient] = useState<(QueryClient & StakingExtension & BankExtension & TxExtension & DistributionExtension) | null>(
    null
  );
  const [tmClient, setTmClient] = useState<Tendermint34Client | null>(null);
  const [network, setNetwork] = useState<Network | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isReady, setIsReady] = useState<boolean>(false);
  const [error, setError] = useState<unknown | null>(null);

  useEffect(() => {}, []);

  useEffect(() => {
    const session = getSession();
    if (session?.allowConnection) connectWallet();
    const handlerConnection = () => connectWallet();
    window.addEventListener("keplr_keystorechange", handlerConnection);
    return () => window.removeEventListener("keplr_keystorechange", handlerConnection);
  }, []);

  useEffect(() => {
    setIsLoading(true);
    setNetwork(networkConfig);
    createQueryClient().then(setQueryClient);
    createTendermintClient().then(setTmClient);
    setIsLoading(false);
    return () => tmClient?.disconnect();
  }, [networkConfig]);

  const connectWallet = async () => {
    setIsLoading(true);
    try {
      await connectKeplr();
      const signer = await getSigner();
      const client = await createSignCosmWasmClient(signer);
      const key = await getKey();
      const [{ address: firstAddress, pubkey }] = await signer.getAccounts();
      setPubkey(encodeSecp256k1Pubkey(pubkey));
      setKeyDetails(key!);
      setAddress(firstAddress);
      setSession({ allowConnection: true });
      setSigningClient(client);
      setIsReady(true);
    } catch (error) {
      console.log(error);
      setError(error);
    }
    setIsLoading(false);
  };

  const getBalance = useCallback((addr: string) => queryClient?.bank.balance(addr, network?.feeToken!), [queryClient, network]);

  const disconnect = useCallback(() => {
    setIsLoading(true);
    signingClient?.disconnect();
    deleteSession();
    setAddress(null);
    setKeyDetails(null);
    setSigningClient(null);
    setIsReady(false);
    setIsLoading(false);
  }, []);

  return (
    <CosmWasmContext.Provider
      value={
        {
          address,
          pubkey,
          signingClient,
          queryClient,
          tmClient,
          isLoading,
          isReady,
          keyDetails,
          network,
          error,
          getBalance,
          connectWallet,
          disconnect,
        } as ICosmWasmContext
      }
    >
      {children}
    </CosmWasmContext.Provider>
  );
};

export const useCosm = (): ICosmWasmContext => {
  const context = useContext(CosmWasmContext);
  if (context === null) {
    throw new Error("useCosm must be used within a CosmWasmProvider");
  }
  return context;
};
