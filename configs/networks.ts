const juno_prod = {
  chainId: "juno-1",
  chainName: "Juno",
  addressPrefix: "juno",
  rpcUrl: "https://rpc-juno.itastakers.com/",
  httpUrl: "https://lcd-juno.itastakers.com/",
  feeToken: "ujuno",
  stakingToken: "ujuno",
  coinMap: {
    ujunox: { denom: "JUNO", fractionalDigits: 6 },
  },
  gasPrice: 0.025,
};

const juno_testnet = {
  chainId: "uni-2",
  chainName: "Juno (uni-2)",
  addressPrefix: "juno",
  rpcUrl: "https://rpc.uni.junonetwork.io/",
  httpUrl: "https://api.uni.junonetwork.io/",
  feeToken: "ujunox",
  stakingToken: "ujunox",
  coinMap: {
    ujunox: { denom: "JUNOX", fractionalDigits: 6 },
  },
  gasPrice: 0.025,
};

const juno_local = {
  chainId: "testing",
  chainName: "Juno Local",
  addressPrefix: "juno",
  rpcUrl: "http://localhost:26657",
  httpUrl: "http://localhost:1317",
  feeToken: "ujunox",
  stakingToken: "ujunox",
  coinMap: {
    ujunox: { denom: "JUNOX", fractionalDigits: 6 },
  },
  gasPrice: 0.025,
};

const networks = {
  juno_prod,
  juno_testnet,
  juno_local,
};

export default networks[process.env.NEXT_PUBLIC_NETWORK as keyof typeof networks];
