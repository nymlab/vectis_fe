import { Network, NetworkOptions } from "interfaces/network";
import networks from "configs/networks";
import { OfflineSigner } from "@cosmjs/proto-signing";
import { Key } from "@keplr-wallet/types";

export const isKeplrInstalled = () => {
  // If `window.getOfflineSigner` or `window.keplr` is null, Keplr extension may be not installed on browser.
  return window.getOfflineSigner && window.keplr;
};

export const getSigner = (networkName: NetworkOptions): Promise<OfflineSigner> => {
  const network = networks[networkName];
  return window?.keplr?.getOfflineSignerAuto(network.chainId) as Promise<OfflineSigner>;
};
export const getKey = (networkName: NetworkOptions): Promise<Key> | undefined => {
  const network = networks[networkName];
  return window?.keplr?.getKey(network.chainId);
};

export const connectKeplr = async (networkName: NetworkOptions) => {
  if (!window.keplr || !window.getOfflineSigner) throw new Error("Keplr extension is not installed. Please install it here: https://keplr.app");
  try {
    await window.keplr.enable(networkName);
  } catch (err) {
    await addNetwork(networkName);
    await window.keplr.enable(networkName);
  }
};

const addNetwork = async (networkName: NetworkOptions) => {
  const network = networks[networkName];
  const config = configKeplr(network);
  if (!window.keplr?.experimentalSuggestChain) throw new Error("Your installation of Keplr is outdated. Please update it.");
  await window.keplr.experimentalSuggestChain(config);
};

const configKeplr = (config: Network) => {
  return {
    chainId: config.chainId,
    chainName: config.chainName,
    rpc: config.rpcUrl,
    rest: config.httpUrl,
    bech32Config: {
      bech32PrefixAccAddr: `${config.addressPrefix}`,
      bech32PrefixAccPub: `${config.addressPrefix}pub`,
      bech32PrefixValAddr: `${config.addressPrefix}valoper`,
      bech32PrefixValPub: `${config.addressPrefix}valoperpub`,
      bech32PrefixConsAddr: `${config.addressPrefix}valcons`,
      bech32PrefixConsPub: `${config.addressPrefix}valconspub`,
    },
    currencies: [
      {
        coinDenom: config.coinMap[config.feeToken].denom,
        coinMinimalDenom: config.feeToken,
        coinDecimals: config.coinMap[config.feeToken].fractionalDigits,
      },
      {
        coinDenom: config.coinMap[config.stakingToken].denom,
        coinMinimalDenom: config.stakingToken,
        coinDecimals: config.coinMap[config.stakingToken].fractionalDigits,
      },
    ],
    feeCurrencies: [
      {
        coinDenom: config.coinMap[config.feeToken].denom,
        coinMinimalDenom: config.feeToken,
        coinDecimals: config.coinMap[config.feeToken].fractionalDigits,
      },
    ],
    stakeCurrency: {
      coinDenom: config.coinMap[config.stakingToken].denom,
      coinMinimalDenom: config.stakingToken,
      coinDecimals: config.coinMap[config.stakingToken].fractionalDigits,
    },
    gasPriceStep: {
      low: config.gasPrice / 2,
      average: config.gasPrice,
      high: config.gasPrice * 2,
    },
    bip44: { coinType: 118 },
    coinType: 118,
  };
};
