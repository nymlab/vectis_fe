interface Environment {
  chainId: string;
  chainName: string;
  chainPrefix: string;
  chainRpcEndpoint: string;
  chainRestEndpoint: string;
  stakingDenom: string;
  coinDecimals: string;
  gasPrice: string;
  siteTitle: string;
  siteIconUrl: string;
  contractFactoryAddress: string;
}

export const env: Environment = {
  chainId: process.env.NEXT_PUBLIC_CHAIN_ID!,
  chainName: process.env.NEXT_PUBLIC_CHAIN_NAME!,
  chainPrefix: process.env.NEXT_PUBLIC_CHAIN_BECH32_PREFIX!,
  chainRpcEndpoint: process.env.NEXT_PUBLIC_CHAIN_RPC_ENDPOINT!,
  chainRestEndpoint: process.env.NEXT_PUBLIC_CHAIN_REST_ENDPOINT!,
  stakingDenom: process.env.NEXT_PUBLIC_STAKING_DENOM!,
  coinDecimals: process.env.NEXT_PUBLIC_COIN_DECIMALS!,
  gasPrice: process.env.NEXT_PUBLIC_GAS_PRICE!,
  siteTitle: process.env.NEXT_PUBLIC_SITE_TITLE!,
  siteIconUrl: process.env.NEXT_PUBLIC_SITE_ICON_URL!,
  contractFactoryAddress: process.env.NEXT_PUBLIC_CONTRACT_FACTORY_ADDRESS!,
};
