import Session from "interfaces/session";

export const setItem = <T>(key: string, item: T): void => {
  localStorage.setItem(key, JSON.stringify(item));
};

export const getItem = <T>(key: string): T | null => {
  const item = window.localStorage.getItem(key);
  if (item) return JSON.parse(item);
  return null;
};

export const deleteItem = (key: string): void => {
  localStorage.removeItem(key);
};

export const setTheme = (theme: "dark" | "light"): void => {
  setItem("theme", theme);
};

export const getTheme = (): "dark" | "light" | null => {
  return getItem("theme");
};

export const setSession = (session: Session): void => {
  setItem<Session>("session", session);
};

export const getSession = (): Session | null => {
  return getItem<Session>("session");
};

export const deleteSession = (): void => {
  deleteItem("session");
};
