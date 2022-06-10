import { Vote } from "@dao-dao/types/contracts/cw-proposal-single";
import { createContext, useContext, ReactNode, useState, useEffect, useMemo, useCallback } from "react";
import { Coin, WalletInfo } from "@vectis/types/contracts/FactoryContract";
import { WasmMsg } from "@vectis/types/contracts/ProxyContract";
import { useCosm } from "./cosmwasm";
import { queryProxyWalletInfo, queryProxyWalletsOfUser } from "services/vectis";

export type WalletInfoWithBalance = WalletInfo & { balance: Coin };

export type Proposal = {
  id: number;
  title: string;
  description: string;
  status: string;
  expires: {
    at_time: string;
  };
  msgs: {
    wasm: WasmMsg;
  }[];
  threshold: {
    absolute_count: {
      weight: number;
      total_weight: number;
    };
  };
};

export type VoteInfo = {
  proposal_id: number;
  voter: string;
  vote: Vote;
  weight: number;
};

export interface IVectisContext {
  proxyWallets: string[];
  walletsInfo: Promise<{ address: string; info: WalletInfoWithBalance }[]>;
  isLoading: boolean;
  error: Error;
  getWallets: () => void;
}

const VectisContext = createContext<IVectisContext | null>(null);

export const VectisProvider = ({ children }: { children: ReactNode }) => {
  const { address: userAddress, signingClient } = useCosm();
  const [proxyWallets, setProxyWallets] = useState<string[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const getWallets = useCallback(() => {
    if (!signingClient) return;
    setIsLoading(true);
    console.log(userAddress);
    queryProxyWalletsOfUser(signingClient!, userAddress).then(setProxyWallets).catch(setError);
    setIsLoading(false);
  }, [signingClient]);

  useEffect(() => {
    if (!userAddress) return;
    setIsLoading(true);
    setError(null);
    getWallets();
  }, [userAddress]);

  const walletsInfo = useMemo(
    () =>
      Promise.all(proxyWallets.map(async (address) => ({ address, info: await queryProxyWalletInfo(signingClient!, userAddress, address) }))),
    [proxyWallets]
  );

  return (
    <VectisContext.Provider value={{ proxyWallets, isLoading, walletsInfo, getWallets, error } as IVectisContext}>
      {children}
    </VectisContext.Provider>
  );
};

export const useVectis = () => {
  const context = useContext(VectisContext);
  if (context === null) {
    throw new Error("useVectis must be used within a VectisProvider");
  }
  return context;
};
