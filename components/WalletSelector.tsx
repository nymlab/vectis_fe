import { useVectis } from "contexts/vectis";
import React, { useCallback, useEffect, useState } from "react";
import { IntlAddress } from "utils/intl";
import Dropdown, { DropdownOption } from "./Dropdown";

interface Props {
  onChangeWallet?: (wallet: string) => void;
}

const WalletSelector: React.FC<Props> = ({ onChangeWallet }) => {
  const [walletOptions, setWalletOptions] = useState<DropdownOption[] | null>(null);
  const { proxyWallets } = useVectis();
  useEffect(() => {
    if (proxyWallets) {
      setWalletOptions(proxyWallets.map((wallet) => ({ label: IntlAddress(wallet, 10)!, value: wallet })));
    }
  }, [proxyWallets]);

  const onChange = useCallback(({ value }: DropdownOption) => onChangeWallet?.(value), []);

  if (!walletOptions?.length) return null;

  return <Dropdown initialLabel="Choose a wallet" options={walletOptions} onChange={onChange} />;
};

export default WalletSelector;
