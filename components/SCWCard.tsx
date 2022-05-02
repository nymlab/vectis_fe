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

type SCWCardProps = { title?: string; address: string };
function SCWCard({ title, address }: SCWCardProps) {
  const { walletAddress: userAddress, signingClient } = useSigningClient();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const [walletInfo, setWalletInfo] = useState<WalletInfo | null>(null);

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

  function test() {
    console.log(walletInfo);
    // sendFundsToWallet(
    //   signingClient!,
    //   userAddress,
    //   address,
    //   "juno16g2rahf5846rxzp3fwlswy08fz8ccuwk03k57y",
    //   50
    // );
  }

  return (
    <div
      className="card w-96 bg-base-100 border-2 shadow-xl transition-shadow hover:shadow-2xl hover:cursor-pointer"
      onClick={test}
    >
      <div className="card-body">
        <p
          onClick={copyAddress}
          className="text-left text-[0.56rem] hover:underline hover:text-primary hover:cursor-pointer transition-colors tooltip"
          data-tip="Copy wallet address"
        >
          {address}
        </p>
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
          <AlertError>Failed to retrieve SCW infos. {error.message}</AlertError>
        )}
      </div>
    </div>
  );
}

export default SCWCard;
