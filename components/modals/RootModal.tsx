import React from "react";
import { useModal } from "stores/modal";

const RootModal: React.FC = () => {
  const { children } = useModal();
  return <>{children}</>;
};

export default RootModal;
