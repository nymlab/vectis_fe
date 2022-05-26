import RotateKeyModal from "components/modals/RotateKeyModal";
import { Proposal, WalletInfoWithBalance } from "contexts/vectis";
import { useState } from "react";

type RotateKeyButtonProps = {
  proxyWalletAddress: string;
  proxyWalletInfo: WalletInfoWithBalance;
  keyRotationProposal?: Proposal;
  onKeyRotation: (newAddr: string) => void;
};

export default function RotateKeyButton({
  proxyWalletAddress,
  proxyWalletInfo,
  keyRotationProposal,
  onKeyRotation,
}: RotateKeyButtonProps) {
  const [rotateKeyModalOpen, setRotateKeyModalOpen] = useState(false);

  return (
    <>
      <label
        htmlFor="rotate-key-modal"
        className="btn btn-primary btn-md hover:text-base-100 text-xl rounded-full flex-grow mx-2"
        onClick={() => setRotateKeyModalOpen(true)}
      >
        {proxyWalletInfo?.multisig_address ? "PROPOSE KEY ROTATION" : "ROTATE KEY"}
      </label>

      {rotateKeyModalOpen && (
        <RotateKeyModal walletInfo={proxyWalletInfo} walletAddress={proxyWalletAddress} onKeyRotation={onKeyRotation} />
      )}
    </>
  );
}
