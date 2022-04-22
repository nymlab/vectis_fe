import { useVectisClient } from "hooks/useVectisClient";
import { createContext, useContext, ReactNode } from "react";
import { useSigningClient } from "./cosmwasm";

export interface IVectisContext {
  proxyWallets: string[];
  loading: boolean;
  error: any;
}

let VectisContext: any;
let { Provider } = (VectisContext = createContext<IVectisContext>({
  proxyWallets: [],
  loading: false,
  error: null,
}));

export const useVectis = (): IVectisContext => useContext(VectisContext);

export const VectisProvider = ({ children }: { children: ReactNode }) => {
  const { walletAddress } = useSigningClient();

  const value = useVectisClient(walletAddress);
  return <Provider value={value}>{children}</Provider>;
};
