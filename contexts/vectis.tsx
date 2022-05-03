import { useVectisClient } from "hooks/useVectisClient";
import { createContext, useContext, ReactNode } from "react";
import { WalletInfo } from "services/vectis";
import { useSigningClient } from "./cosmwasm";

export interface IVectisContext {
  proxyWallets: string[];
  loading: boolean;
  error: any;
  fetchWalletsInfo: ((addresses: string[]) => Promise<{ [key: string]: WalletInfo }>) | null;
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
