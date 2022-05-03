import { createContext, useContext, ReactNode } from "react";
import { useSigningCosmWasmClient } from "hooks/useSigningCosmWasmClient";
import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";

export interface ISigningCosmWasmClientContext {
  walletAddress: string;
  signingClient: SigningCosmWasmClient | null;
  loading: boolean;
  error: any;
  connectWallet: any;
  disconnect: Function;
}

let CosmWasmContext: any;
let { Provider } = (CosmWasmContext = createContext<ISigningCosmWasmClientContext>({
  walletAddress: "",
  signingClient: null,
  loading: false,
  error: null,
  connectWallet: () => {},
  disconnect: () => {},
}));

export const useSigningClient = (): ISigningCosmWasmClientContext => useContext(CosmWasmContext);

export const SigningCosmWasmProvider = ({ children }: { children: ReactNode }) => {
  const value = useSigningCosmWasmClient();
  return <Provider value={value}>{children}</Provider>;
};
