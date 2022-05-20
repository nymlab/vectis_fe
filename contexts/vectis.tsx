import { useVectisClient } from "hooks/useVectisClient";
import { createContext, useContext, ReactNode } from "react";
import { Coin, WalletInfo } from "types/FactoryContract";
import { WasmMsg } from "types/ProxyContract";
import { useSigningClient } from "./cosmwasm";

export type WalletInfoWithBalance = WalletInfo & { balance: Coin };
export type Proposal = {
  id: number;
  title: string;
  description: string;
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

export interface IVectisContext {
  proxyWallets: string[];
  loading: boolean;
  error: any;
  fetchWalletsInfo: ((addresses: string[]) => Promise<{ [key: string]: WalletInfoWithBalance }>) | null;
}

let VectisContext: any;
let { Provider } = (VectisContext = createContext<IVectisContext>({
  proxyWallets: [],
  loading: false,
  error: null,
  fetchWalletsInfo: null,
}));

export const useVectis = (): IVectisContext => useContext(VectisContext);

export const VectisProvider = ({ children }: { children: ReactNode }) => {
  const { walletAddress } = useSigningClient();

  const value = useVectisClient(walletAddress);
  return <Provider value={value}>{children}</Provider>;
};
