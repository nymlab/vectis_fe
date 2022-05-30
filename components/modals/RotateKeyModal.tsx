import { AlertError, AlertSuccess } from "components/Alert";
import { Input } from "components/Input";
import Loader from "components/Loader";
import Modal from "components/Modal";
import { useSigningClient } from "contexts/cosmwasm";
import { WalletInfoWithBalance } from "contexts/vectis";
import { useValidationErrors } from "hooks/useValidationErrors";
import { useState } from "react";
import { proposeProxyWalletOperation, rotateUserKey, SCWOperation } from "services/vectis";

type RotateKeyModalProps = {
  proxyWalletInfo: WalletInfoWithBalance | null;
  proxyWalletAddress: string;
  onKeyRotation?: (newAddr: string) => void;
  onKeyRotationProposal?: (newAddr: string) => void;
  onClose?: () => void;
};

export default function RotateKeyModal({
  proxyWalletInfo,
  proxyWalletAddress,
  onKeyRotation,
  onKeyRotationProposal,
  onClose,
}: RotateKeyModalProps) {
  const { signingClient, walletAddress: userAddress } = useSigningClient();

  const [newOwnerAddress, setNewOwnerAddress] = useState("");
  const { getValueValidationError, checkValidationErrors, clearValidationErrors } = useValidationErrors({
    validators: [
      {
        key: "ownerAddress",
        value: newOwnerAddress,
        message: "This field is mandatory",
        validate: () => !!newOwnerAddress,
      },
    ],
  });

  const [isRotating, setIsRotating] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [success, setSuccess] = useState("");

  function handleCloseModal() {
    setNewOwnerAddress("");
    clearValidationErrors();
    onClose?.();
  }

  // This function should be called only if the proxy wallet is NOT multisig
  // Otherwise it will error out
  function rotateKey() {
    if (!checkValidationErrors()) {
      return;
    }

    setError(null);
    setIsRotating(true);
    rotateUserKey(signingClient!, userAddress, proxyWalletAddress, newOwnerAddress)
      .then(() => {
        setSuccess(`Key rotation has been executed correctly!`);
        setNewOwnerAddress("");
        onKeyRotation?.(newOwnerAddress);
      })
      .catch((err) => setError(err))
      .finally(() => setIsRotating(false));
  }

  // This function should be called only if the proxy wallet IS multisig
  function proposeKeyRotation() {
    if (!proxyWalletInfo?.multisig_address) {
      console.warn("Tried to call proposeKeyRotation on a non-multisig wallet.");
      return;
    }

    setIsRotating(true);
    proposeProxyWalletOperation(
      signingClient!,
      userAddress,
      proxyWalletAddress,
      proxyWalletInfo.multisig_address!,
      SCWOperation.RotateKey,
      newOwnerAddress
    )
      .then(() => {
        setSuccess(`Rotate key operation was proposed successfully!`);
        setNewOwnerAddress("");
        onKeyRotationProposal?.(newOwnerAddress);
      })
      .catch((err) => {
        console.error(err);
        setError(err);
      })
      .finally(() => setIsRotating(false));
  }

  return (
    <Modal id={`rotate-key-modal`} onClose={handleCloseModal}>
      <h3 className="text-xl font-bold mb-5">
        {proxyWalletInfo?.multisig_address ? "Propose owner key rotation" : "Rotate wallet owner key"}
      </h3>
      <div className="flex flex-col items-center">
        {!isRotating ? (
          <>
            <div className="flex flex-col w-full items-start">
              <div className="w-full">
                <Input
                  placeholder="New owner address"
                  onChange={(event) => setNewOwnerAddress(event.target.value)}
                  error={getValueValidationError("ownerAddress")}
                  value={newOwnerAddress}
                  autoComplete="off"
                />
              </div>
            </div>
            <div
              className="btn btn-primary mt-5 text-xl rounded-full"
              onClick={proxyWalletInfo?.multisig_address ? proposeKeyRotation : rotateKey}
            >
              {proxyWalletInfo?.multisig_address ? "Propose key rotation" : "Rotate key"}
            </div>
          </>
        ) : (
          <>
            <Loader>
              {proxyWalletInfo?.multisig_address ? "Proposing key rotation..." : "Performing key rotation..."}
            </Loader>
          </>
        )}
      </div>

      {success && (
        <div className="mt-5">
          <AlertSuccess>{success}</AlertSuccess>
        </div>
      )}

      {error && (
        <div className="mt-5">
          <AlertError>Error! {error.message}</AlertError>
        </div>
      )}
    </Modal>
  );
}
