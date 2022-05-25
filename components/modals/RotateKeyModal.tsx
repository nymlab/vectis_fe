import { AlertError, AlertSuccess } from "components/Alert";
import { Input } from "components/Input";
import Loader from "components/Loader";
import { useSigningClient } from "contexts/cosmwasm";
import { WalletInfoWithBalance } from "contexts/vectis";
import { useValidationErrors } from "hooks/useValidationErrors";
import { useState } from "react";
import { rotateUserKey } from "services/vectis";

type RotateKeyModalProps = {
  walletInfo: WalletInfoWithBalance | null;
  walletAddress: string;
  onKeyRotation?: (newAddr: string) => void;
  onClose?: () => void;
};

export default function RotateKeyModal({ walletInfo, walletAddress, onKeyRotation, onClose }: RotateKeyModalProps) {
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
    rotateUserKey(signingClient!, userAddress, walletAddress, newOwnerAddress)
      .then(() => {
        setSuccess(`Key rotation has been executed correctly!`);
        setNewOwnerAddress("");
        onKeyRotation?.(newOwnerAddress);
      })
      .catch((err) => setError(err))
      .finally(() => setIsRotating(false));
  }

  return (
    <>
      <input type="checkbox" id={`rotate-key-modal`} className="modal-toggle" />
      <div className="modal">
        <div className="modal-box relative">
          <label
            htmlFor={`rotate-key-modal`}
            onClick={handleCloseModal}
            className="btn btn-sm btn-circle absolute right-2 top-2"
          >
            ✕
          </label>

          <h3 className="text-xl font-bold mb-5">Rotate wallet owner key</h3>
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
                <div className="btn btn-primary mt-5 text-xl rounded-full" onClick={rotateKey}>
                  Rotate key
                </div>
              </>
            ) : (
              <>
                <Loader>Performing key rotation...</Loader>
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
        </div>
      </div>
    </>
  );
}
