import { AlertError, AlertSuccess } from "components/Alert";
import { Input } from "components/Input";
import Loader from "components/Loader";
import Modal from "components/Modal";
import TokenAmount from "components/TokenAmount";
import { useCosm } from "contexts/cosmwasm";
import { WalletInfoWithBalance } from "contexts/vectis";
import { useValidationErrors } from "hooks/useValidationErrors";
import { useState } from "react";
import { transferFundsFromProxyWallet } from "services/vectis";
import { convertFromMicroDenom, convertMicroDenomToDenom } from "utils/conversion";
import network from "configs/networks";

type SendFundsModalProps = {
  walletInfo: WalletInfoWithBalance | null;
  walletAddress: string;
  onSentFunds: () => void;
  onClose?: () => void;
};

export default function SendFundsModal({ walletInfo, walletAddress, onSentFunds, onClose }: SendFundsModalProps) {
  const { address: userAddress, signingClient } = useCosm();

  const [receiverAddress, setReceiverAddress] = useState("");
  const [amountToSend, setAmountToSend] = useState("");
  const { getValueValidationError, checkValidationErrors, clearValidationErrors } = useValidationErrors({
    validators: [
      {
        key: "receiverAddress",
        value: receiverAddress,
        message: "This field is mandatory",
        validate: () => !!receiverAddress,
      },
      {
        key: "receiverAddress",
        value: receiverAddress,
        message: "Can't send funds to your own SCW",
        validate: () => receiverAddress !== walletAddress,
      },
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
        message: `This SCW doesn't have enough ${convertFromMicroDenom(network.stakingToken)}`,
        validate: () => parseFloat(amountToSend) < convertMicroDenomToDenom(walletInfo?.balance.amount ?? 0),
      },
    ],
  });

  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState("");
  const [sendError, setSendError] = useState("");

  function sendFunds() {
    if (!checkValidationErrors()) {
      return;
    }

    setIsSending(true);
    transferFundsFromProxyWallet(signingClient!, userAddress, walletAddress, receiverAddress, parseFloat(amountToSend))
      .then(() => {
        setSendSuccess(`Successfully sent ${amountToSend} ${convertFromMicroDenom(network.stakingToken)}!`);
        setAmountToSend("");
        onSentFunds();
      })
      .catch((err) => setSendError(`Failed to send funds to receiver. Error: ${err}`))
      .finally(() => setIsSending(false));
  }

  function handleCloseModal() {
    setReceiverAddress("");
    setAmountToSend("");
    setSendSuccess("");
    setSendError("");
    clearValidationErrors();
    onClose?.();
  }

  return (
    <Modal id={`send-modal-${walletAddress}`} onClose={handleCloseModal}>
      <h3 className="text-xl font-bold">Send funds to address through wallet</h3>
      <h4 className="text-lg">
        Available inside wallet: <TokenAmount token={walletInfo?.balance} />
      </h4>
      <div className="flex flex-col items-center">
        {!isSending ? (
          <>
            <div className="my-5 w-full">
              <Input
                placeholder="Receiver address"
                onChange={(event) => setReceiverAddress(event.target.value)}
                error={getValueValidationError("receiverAddress")}
                value={receiverAddress}
                autoComplete="off"
              />
            </div>
            <div className="flex flex-col w-full items-start">
              <div className="relative rounded-full shadow-sm w-full">
                <input
                  type="number"
                  className={`input input-bordered focus:input-primary input-lg w-full pr-24 rounded-full text-center font-mono text-lg ${
                    getValueValidationError("amountToSend") ? "input-error" : ""
                  }`}
                  placeholder="Amount to send"
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
            <div className="btn btn-primary mt-5 text-xl rounded-full" onClick={sendFunds}>
              Send
            </div>
          </>
        ) : (
          <>
            <Loader>Sending funds to the receiver...</Loader>
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
