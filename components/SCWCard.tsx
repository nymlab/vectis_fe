import { useEffect, useState } from "react";
import { queryVectisWalletInfo, WalletInfo } from "services/vectis";
import { AlertError } from "./Alert";
import { IconChip } from "./Icon";
import { isDarkMode } from "./ThemeToggle";
import Loader from "./Loader";
import TokenAmount from "./TokenAmount";
import SendFundsModal from "./modals/SendFundsModal";

type SCWCardProps = {
  address: string;
  title?: string;
  onRefresh?: () => void;
};

export default function SCWCard({ address, title, onRefresh }: SCWCardProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const [walletInfo, setWalletInfo] = useState<WalletInfo | null>(null);
  const [refresh, setRefresh] = useState(false);

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

  function doRefresh() {
    setRefresh(!refresh);
    onRefresh?.();
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
            <div className="ml-[3px] p-2 mt-10 bg-base-content text-left">
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

      <SendFundsModal
        wallet={walletInfo}
        walletAddress={address}
        onSentFunds={doRefresh}
      />
    </>
  );
}
