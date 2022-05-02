import { useEffect, useState } from "react";
import {
  queryVectisWalletInfo,
  sendFundsToWallet,
  WalletInfo,
} from "services/vectis";
import { AlertError, AlertSuccess } from "./Alert";
import { IconChip } from "./Icon";
import { isDarkMode } from "./ThemeToggle";
import Loader from "./Loader";
import { convertFromMicroDenom } from "util/conversion";
import { useSigningClient } from "contexts/cosmwasm";
import { env } from "env";
import { Input } from "./Input";
import TokenAmount from "./TokenAmount";
import { useValidationErrors } from "hooks/useValidationErrors";

type SCWCardProps = { title?: string; address: string };
function SCWCard({ title, address }: SCWCardProps) {
  const { walletAddress: userAddress, signingClient } = useSigningClient();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const [walletInfo, setWalletInfo] = useState<WalletInfo | null>(null);
  const [refresh, setRefresh] = useState(false);

  const [receiverAddress, setReceiverAddress] = useState("");
  const [amountToSend, setAmountToSend] = useState("");
  const { getValueValidationError, checkValidationErrors } =
    useValidationErrors({
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
          validate: () => receiverAddress !== address,
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
          message: `This SCW doesn't have enough ${convertFromMicroDenom(
            env.stakingDenom
          )}`,
          validate: () =>
            parseFloat(amountToSend) < (walletInfo?.balance.amount ?? 0),
        },
      ],
    });

  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState("");
  const [sendError, setSendError] = useState("");

  useEffect(() => {
    setLoading(true);

    queryVectisWalletInfo(address)
      .then((info) => setWalletInfo(info))
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, [address, refresh]);

  function copyAddress() {
    navigator.clipboard.writeText(address);
  }

  function sendFunds() {
    if (!checkValidationErrors()) {
      return;
    }

    setIsSending(true);
    sendFundsToWallet(
      signingClient!,
      userAddress,
      address,
      receiverAddress,
      parseFloat(amountToSend)
    )
      .then(() => {
        setSendSuccess(
          `Successfully sent ${amountToSend} ${convertFromMicroDenom(
            env.stakingDenom
          )}!`
        );
        setRefresh(!refresh);
      })
      .catch((err) =>
        setSendError(`Failed to send funds to receiver. Error: ${err}`)
      )
      .finally(() => setIsSending(false));
  }

  function handleCloseModal() {
    setReceiverAddress("");
    setAmountToSend("");
    setSendSuccess("");
    setSendError("");
  }

  return (
    <>
      <div className="perspective transition-shadow relative group">
        <div className="w-96 h-56 overflow-visible card bg-base-100 border-2 shadow-xl hover:shadow-2xl hover:cursor-pointer transition-transform delay-300 duration-700 preserve-3d group-hover:rotate-y-180">
          <div className="card-body w-96 h-56 absolute backface-hidden">
            <h2 className="card-title flex space-x-2 items-center text-left my-3">
              <IconChip fill={isDarkMode() ? "#FFF" : "#000"} />
              <p>{title || "Smart Contract Wallet"}</p>
            </h2>

            {loading ? (
              <Loader />
            ) : (
              <div className="text-left">
                <p>
                  No. of guardians: {walletInfo?.guardians.length} | No. of
                  relayers: {walletInfo?.relayers.length}
                </p>
                <p>
                  Frozen: {walletInfo?.is_frozen ? "yes" : "no"} | Multisig:{" "}
                  {walletInfo?.multisig_address ? "yes" : "no"}
                </p>

                <h2 className="mt-5 text-2xl font-bold">
                  <TokenAmount token={walletInfo?.balance} />
                </h2>
              </div>
            )}

            {error && (
              <AlertError>
                Failed to retrieve SCW infos. {error.message}
              </AlertError>
            )}
          </div>

          <div className="w-96 h-56 absolute rotate-y-180 backface-hidden">
            <div className="w-[99%] ml-[3px] p-2 mt-10 bg-base-content">
              <p
                onClick={copyAddress}
                className="text-left text-base-100 text-[0.7rem] hover:underline hover:text-primary hover:cursor-pointer transition-colors tooltip"
                data-tip="Copy wallet address"
              >
                {address}
              </p>
            </div>

            <div className="card-body">
              <div className="flex space-x-2 mt-7">
                <label
                  htmlFor={`send-modal-${address}`}
                  className="btn modal-button btn-outline btn-primary"
                >
                  Send
                </label>
                <button className="btn btn-outline btn-primary">Charge</button>
                <button className="btn btn-outline btn-primary">Manage</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <input
        type="checkbox"
        id={`send-modal-${address}`}
        className="modal-toggle"
      />
      <div className="modal">
        <div className="modal-box relative">
          <label
            htmlFor={`send-modal-${address}`}
            onClick={handleCloseModal}
            className="btn btn-sm btn-circle absolute right-2 top-2"
          >
            ✕
          </label>
          <h3 className="text-xl font-bold">
            Send funds to address through wallet
          </h3>
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
                        getValueValidationError("amountToSend")
                          ? "input-error"
                          : ""
                      }`}
                      placeholder="Amount to send"
                      step="0.1"
                      min="0"
                      onChange={(event) => setAmountToSend(event.target.value)}
                      value={amountToSend}
                    />
                    <span className="absolute top-0 right-0 bottom-0 px-4 py-5 rounded-r-full bg-secondary text-base-100 text-sm">
                      {convertFromMicroDenom(env.stakingDenom)}
                    </span>
                  </div>
                  {getValueValidationError("amountToSend") && (
                    <span className="pl-6 text-error font-bold">
                      {getValueValidationError("amountToSend")}
                    </span>
                  )}
                </div>
                <div
                  className="btn btn-primary mt-5 text-xl rounded-full"
                  onClick={sendFunds}
                >
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
        </div>
      </div>
    </>
  );
}

export default SCWCard;
