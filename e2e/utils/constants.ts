import path from "path";

export const USER_WALLET = {
  name: "wallet-user",
  password: "fake-password",
  address: "juno104vyyfqys5qhepxgkgcc25zew57rapgs7jddrq",
  mnemonic: "candy maple cake sugar pudding cream honey rich smooth crumble sweet treat",
};

// Paths
export const EXTENSIONS_PATH = path.join(__dirname, "../extensions");
export const CACHE_PATH = path.join(__dirname, "../.cache");
export const PLAYWRIGHT_PATH = path.join(CACHE_PATH, "./playwright");

// Extensions
export const KEPLER_EXTENSION = {
  id: "dmkamcknogkgcdfhhbddcghachkejeap",
  ver: "0.8.9_0",
  get path() {
    return path.join(CACHE_PATH, this.id, this.ver);
  },
};
