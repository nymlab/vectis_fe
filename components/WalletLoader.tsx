import { Popover, Transition } from "@headlessui/react";
import clsx from "clsx";
import { Fragment, useEffect, useState } from "react";
import { FaCopy, FaPowerOff, FaRedo } from "react-icons/fa";
import { copyToClipboard } from "utils/clipboard";
import { convertMicroDenomToDenom } from "utils/conversion";

import { WalletButton } from "./buttons/WalletButton";
import { WalletPanelButton } from "./WalletPanelButton";
import { useCosm } from "contexts/cosmwasm";
import { Coin } from "@cosmjs/proto-signing";
import { IntlAddress } from "utils/intl";

export const WalletLoader = () => {
  const { address, isReady, isLoading, keyDetails, getBalance, connectWallet, disconnect } = useCosm();
  const [balance, setBalance] = useState<Coin | null>(null);
  const shortAddr = address && IntlAddress(address);
  const displayName = keyDetails?.name || shortAddr;

  useEffect(() => {
    if (!address) return;
    getBalance(address).then(setBalance);
  }, [address]);

  return (
    <Popover className="my-8">
      {({ close }) => (
        <>
          <div className="grid -mx-4">
            {!isReady && (
              <WalletButton className="w-full text-white" data-testid="wallet-connect" isLoading={isLoading} onClick={() => connectWallet()}>
                Connect Wallet
              </WalletButton>
            )}

            {isReady && (
              <Popover.Button as={WalletButton} data-testid="wallet-connect" className="w-full text-white" isLoading={isLoading}>
                {displayName}
              </Popover.Button>
            )}
          </div>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 -translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 -translate-y-1"
          >
            <Popover.Panel
              className={clsx(
                "absolute inset-x-4 mt-2",
                "bg-stone-800/80 rounded shadow-lg shadow-black/90 backdrop-blur-sm",
                "flex flex-col items-stretch text-sm divide-y divide-white/10"
              )}
            >
              <div className="flex flex-col items-center py-2 px-4 space-y-1 text-center">
                <span className="py-px px-2 mb-2 font-mono text-xs text-white/50 rounded-full border border-white/25">{shortAddr}</span>
                <div className="font-bold text-white">Your Balance</div>
                {balance && (
                  <span key={`balance-${balance.denom}`} className="text-white">
                    {convertMicroDenomToDenom(balance.amount)} {balance.denom.slice(1, balance.denom.length)}
                  </span>
                )}
              </div>
              <WalletPanelButton Icon={FaCopy} onClick={() => copyToClipboard(address)}>
                Copy wallet address
              </WalletPanelButton>
              <WalletPanelButton Icon={FaRedo} onClick={() => connectWallet()}>
                Reconnect
              </WalletPanelButton>
              <WalletPanelButton Icon={FaPowerOff} onClick={() => [disconnect(), close()]}>
                Disconnect
              </WalletPanelButton>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
};
