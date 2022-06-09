declare namespace NodeJS {
  interface ProcessEnv {
    readonly NEXT_PUBLIC_NETWORK: string;
    readonly NEXT_PUBLIC_CONTRACT_FACTORY_ADDRESS: string;
  }
}
