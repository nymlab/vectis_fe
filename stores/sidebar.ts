import create from "zustand";

export const useSidebar = create(() => ({ isOpen: true }));

export const openSidebar = () => {
  useSidebar.setState({ isOpen: true });
};
export const closeSidebar = () => {
  useSidebar.setState({ isOpen: false });
};
export const toggleSidebar = () => {
  useSidebar.setState((prev) => ({ isOpen: !prev.isOpen }));
};
