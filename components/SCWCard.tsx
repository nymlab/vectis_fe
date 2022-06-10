import { useEffect, useState } from "react";
import { queryProxyWalletInfo } from "services/vectis";
import { AlertError } from "./Alert";
import { IconChip, IconFreeze, IconSignature } from "./Icon";
import { WalletInfoWithBalance } from "contexts/vectis";
import { useCosm } from "contexts/cosmwasm";
import Loader from "./Loader";
import TokenAmount from "./TokenAmount";
import SendFundsModal from "./modals/SendFundsModal";
import ChargeWalletModal from "./modals/ChargeWalletModal";
import Link from "next/link";

type SCWCardProps = {
  address: string;
  title?: string;
  onRefresh?: () => void;
};

export default function SCWCard({ address, title, onRefresh }: SCWCardProps) {
  const { signingClient, address: walletAddress } = useCosm();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [walletInfo, setWalletInfo] = useState<WalletInfoWithBalance | null>(null);
  const [refresh, setRefresh] = useState(false);

  const [modalSendOpen, setModalSendOpen] = useState(false);
  const [modalChargeOpen, setModalChargeOpen] = useState(false);

  useEffect(() => {
    setLoading(true);

    queryProxyWalletInfo(signingClient!, walletAddress, address)
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
        <div className="w-96 h-56 overflow-visible card bg-base-100 border-2 shadow-xl hover:shadow-2xl transition-transform delay-300 duration-700 preserve-3d group-hover:rotate-y-180">
          <div className="card-body w-96 h-56 absolute backface-hidden">
            <h2 className="card-title flex space-x-2 items-center text-left my-3">
              <IconChip />
              <p>{title || walletInfo?.label || "Smart Contract Wallet"}</p>
            </h2>

            {loading ? (
              <Loader />
            ) : (
              <div className="text-left">
                <p>Guardians: {walletInfo?.guardians.length}</p>
                <p>Relayers: {walletInfo?.relayers.length}</p>

                <h2 className="mt-5 text-[1.65rem] font-bold flex items-center justify-between">
                  <TokenAmount token={walletInfo?.balance} />
                  <p className="flex space-x-2">
                    {walletInfo?.is_frozen && <IconFreeze />}
                    {walletInfo?.multisig_address && <IconSignature />}
                  </p>
                </h2>
              </div>
            )}

            {error && <AlertError>Failed to retrieve SCW infos. {error.message}</AlertError>}
          </div>

          <div className="w-96 h-56 absolute rotate-y-180 backface-hidden">
            <div className="ml-[3px] p-2 mt-10 bg-base-content text-center">
              <p
                onClick={copyAddress}
                className="text-center text-base-100 text-[0.6rem] hover:underline hover:text-primary hover:cursor-pointer transition-colors tooltip"
                data-tip="Copy wallet address"
              >
                {address}
              </p>
            </div>

            <div className="card-body">
              <div className="flex justify-end space-x-2 mt-12">
                <label
                  htmlFor={`send-modal-${address}`}
                  className={`btn modal-button btn-sm ${walletInfo?.is_frozen ? "btn-disabled" : "btn-primary"}`}
                  onClick={() => setModalSendOpen(true)}
                >
                  Transfer
                </label>
                <label
                  htmlFor={`charge-modal-${address}`}
                  className={`btn modal-button btn-sm ${walletInfo?.is_frozen ? "btn-disabled" : "btn-primary"}`}
                  onClick={() => setModalChargeOpen(true)}
                >
                  Charge
                </label>
                <label className="btn btn-primary btn-sm">
                  <Link href={`/wallets/manage/${address}`} passHref={true}>
                    Manage
                  </Link>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {modalSendOpen && (
        <SendFundsModal walletInfo={walletInfo} walletAddress={address} onSentFunds={doRefresh} onClose={() => setModalSendOpen(false)} />
      )}
      {modalChargeOpen && (
        <ChargeWalletModal walletInfo={walletInfo} walletAddress={address} onChargeDone={doRefresh} onClose={() => setModalChargeOpen(false)} />
      )}
    </>
  );
}
