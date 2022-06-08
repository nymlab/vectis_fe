export const setItem = <T>(key: string, item: T): void => {
  localStorage.setItem(key, JSON.stringify(item));
};

export const getItem = <T>(key: string): T | null => {
  const item = localStorage.getItem(key);
  if (item) return JSON.parse(item);
  return null;
};

export const deleteItem = (key: string): void => {
  localStorage.removeItem(key);
};

export const setWalletAddress = (addr: string): void => {
  setItem<string>("walletAddress", addr);
};

export const getWalletAddress = (): string | null => {
  return getItem<string>("walletAddress");
};

export const deleteWalletAddress = (): void => {
  deleteItem("walletAddress");
};
