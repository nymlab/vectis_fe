import { useEffect, useState } from "react";
import {
  queryVectisWalletInfo,
  sendFundsToWallet,
  WalletInfo,
} from "services/vectis";
import { AlertError } from "./Alert";
import { IconChip } from "./Icon";
import { isDarkMode } from "./ThemeToggle";
import Loader from "./Loader";
import {
  convertFromMicroDenom,
  convertMicroDenomToDenom,
} from "util/conversion";
import { useSigningClient } from "contexts/cosmwasm";
import { env } from "env";
import { Input } from "./Input";

type SCWCardProps = { title?: string; address: string };
function SCWCard({ title, address }: SCWCardProps) {
  const { walletAddress: userAddress, signingClient } = useSigningClient();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const [walletInfo, setWalletInfo] = useState<WalletInfo | null>(null);

  const [receiverAddress, setReceiverAddress] = useState("");
  const [amountToSend, setAmountToSend] = useState("");

  useEffect(() => {
    setLoading(true);

    queryVectisWalletInfo(address)
      .then((info) => setWalletInfo(info))
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, [address]);

  function copyAddress() {
    navigator.clipboard.writeText(address);
  }

  function sendFunds() {
    sendFundsToWallet(
      signingClient!,
      userAddress,
      address,
      receiverAddress,
      parseFloat(amountToSend)
    );
  }

  return (
    <>
      <div className="perspective transition-shadow relative group">
        <div className="w-96 h-56 overflow-visible card bg-base-100 border-2 shadow-xl hover:shadow-2xl hover:cursor-pointer transition-transform duration-700 preserve-3d group-hover:rotate-y-180">
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
                  {convertMicroDenomToDenom(walletInfo?.balance.amount ?? 0)}{" "}
                  {convertFromMicroDenom(walletInfo?.balance.denom ?? "")}
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
                  htmlFor="send-modal"
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

      <input type="checkbox" id="send-modal" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box relative">
          <label
            htmlFor="send-modal"
            className="btn btn-sm btn-circle absolute right-2 top-2"
          >
            ✕
          </label>
          <h3 className="text-lg font-bold">
            Send funds to address through wallet
          </h3>
          <div className="flex flex-col items-center">
            <div className="my-5">
              <Input
                placeholder="Receiver address"
                onChange={(event) => setReceiverAddress(event.target.value)}
                error={null}
                value={receiverAddress}
                autocomplete="false"
              />
            </div>
            <div className="relative rounded-full shadow-sm">
              <input
                type="number"
                className={`input input-bordered focus:input-primary input-lg w-full pr-24 rounded-full text-center font-mono text-lg`}
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
            {/* {getValueValidationError("proxyInitialFunds") && (
                <span className="pl-6 text-error font-bold">
                  {getValueValidationError("proxyInitialFunds")}
                </span>
              )} */}
            <div className="btn btn-primary mt-5 text-xl rounded-full">
              Send
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default SCWCard;
