import path from "path";

export const USER_WALLET = {
  name: "wallet-user",
  password: "fake-password",
  address: "juno1tcxyhajlzvdheqyackfzqcmmfcr760malxrvqr",
  mnemonic:
    "useful guitar throw awesome later damage film tonight escape burger powder manage exact start title december impulse random similar eager smart absurd unaware enlist",
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
