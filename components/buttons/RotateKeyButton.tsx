import RotateKeyModal from "components/modals/RotateKeyModal";
import { WalletInfoWithBalance } from "contexts/vectis";
import { useState } from "react";

type RotateKeyButtonProps = {
  proxyWalletAddress: string;
  proxyWalletInfo: WalletInfoWithBalance;
  onKeyRotation: (newAddr: string) => void;
};

export default function RotateKeyButton({ proxyWalletAddress, proxyWalletInfo, onKeyRotation }: RotateKeyButtonProps) {
  const [rotateKeyModalOpen, setRotateKeyModalOpen] = useState(false);

  if (proxyWalletInfo?.multisig_address) {
    return (
      <>
        <label
          className="btn btn-primary btn-md hover:text-base-100 text-xl rounded-full flex-grow mx-2"
          onClick={() => {}}
        >
          PROPOSE KEY ROTATION
        </label>
      </>
    );
  }

  return (
    <>
      <label
        htmlFor="rotate-key-modal"
        className="btn btn-primary btn-md hover:text-base-100 text-xl rounded-full flex-grow mx-2"
        onClick={() => setRotateKeyModalOpen(true)}
      >
        ROTATE KEY
      </label>

      {rotateKeyModalOpen && (
        <RotateKeyModal walletInfo={proxyWalletInfo} walletAddress={proxyWalletAddress} onKeyRotation={onKeyRotation} />
      )}
    </>
  );
}
