import { AlertError, AlertSuccess } from "components/Alert";
import Loader from "components/Loader";
import Modal from "components/Modal";
import { useCosm } from "contexts/cosmwasm";
import { useBalance } from "hooks/useBalance";
import { useValidationErrors } from "hooks/useValidationErrors";
import { useState } from "react";
import { WalletInfo } from "@vectis/types/contracts/FactoryContract";
import { coin, convertFromMicroDenom } from "utils/conversion";
import network from "configs/networks";

type ChargeWalletModalProps = {
  walletInfo: WalletInfo | null;
  walletAddress: string;
  onChargeDone: () => void;
  onClose?: () => void;
};

export default function ChargeWalletModal({ walletInfo, walletAddress, onChargeDone, onClose }: ChargeWalletModalProps) {
  const { balance } = useBalance();
  const { address: userAddress, signingClient } = useCosm();

  const [amountToSend, setAmountToSend] = useState("");
  const { getValueValidationError, checkValidationErrors, clearValidationErrors } = useValidationErrors({
    validators: [
      {
        key: "amountToSend",
        value: amountToSend,
        message: "This field is mandatory",
        validate: () => !!amountToSend,
      },
      {
        key: "amountToSend",
        value: amountToSend,
        message: "This field must be > 0",
        validate: () => parseFloat(amountToSend) > 0,
      },
      {
        key: "amountToSend",
        value: amountToSend,
        message: `You don't have enough ${convertFromMicroDenom(network.stakingToken)}`,
        validate: () => parseFloat(amountToSend) < parseFloat(balance),
      },
    ],
  });

  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState("");
  const [sendError, setSendError] = useState("");

  function chargeWallet() {
    if (!checkValidationErrors()) {
      return;
    }

    setIsSending(true);
    signingClient
      ?.sendTokens(userAddress, walletAddress, [coin(parseFloat(amountToSend))], "auto")
      .then(() => {
        setSendSuccess(`Successfully sent ${amountToSend} ${convertFromMicroDenom(network.stakingToken)} into the SCW!`);
        setAmountToSend("");
        onChargeDone();
      })
      .catch((err) => setSendError(`Failed to top-up SCW. ${err}`))
      .finally(() => setIsSending(false));
  }

  function handleCloseModal() {
    setAmountToSend("");
    setSendSuccess("");
    setSendError("");
    clearValidationErrors();
    onClose?.();
  }

  return (
    <Modal id={`charge-modal-${walletAddress}`} onClose={handleCloseModal}>
      <h3 className="text-xl font-bold">Top-up your Smart Contract Wallet</h3>
      <h4 className="text-md">{balance} is available</h4>
      <div className="flex flex-col items-center">
        {!isSending ? (
          <>
            <div className="flex flex-col w-full items-start">
              <div className="relative rounded-full shadow-sm w-full mt-5">
                <input
                  type="number"
                  className={`input input-bordered focus:input-primary input-lg w-full pr-24 rounded-full text-center font-mono text-lg ${
                    getValueValidationError("amountToSend") ? "input-error" : ""
                  }`}
                  placeholder="Amount to charge"
                  step="0.1"
                  min="0"
                  onChange={(event) => setAmountToSend(event.target.value)}
                  value={amountToSend}
                />
                <span className="absolute top-0 right-0 bottom-0 px-4 py-5 rounded-r-full bg-secondary text-base-100 text-sm">
                  {convertFromMicroDenom(network.stakingToken)}
                </span>
              </div>
              {getValueValidationError("amountToSend") && (
                <span className="pl-6 text-error font-bold">{getValueValidationError("amountToSend")}</span>
              )}
            </div>
            <div className="btn btn-primary mt-5 text-xl rounded-full" onClick={chargeWallet}>
              Top-up
            </div>
          </>
        ) : (
          <>
            <Loader>Sending funds to the wallet...</Loader>
          </>
        )}

        {sendSuccess && (
          <div className="mt-4 flex flex-col w-full max-w-xl">
            <AlertSuccess>{sendSuccess}</AlertSuccess>
          </div>
        )}

        {sendError && (
          <div className="mt-4 flex flex-col w-full max-w-xl">
            <AlertError>{sendError}</AlertError>
          </div>
        )}
      </div>
    </Modal>
  );
}
