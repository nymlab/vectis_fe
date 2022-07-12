import { AlertError } from "components/Alert";
import ConnectWallet from "components/ConnectWallet";
import Loader from "components/Loader";
import SCWCard from "components/SCWCard";
import { useTranslations } from "contexts/TranslationsContext";
import { useVectis } from "contexts/vectis";
import { useBalance } from "hooks/useBalance";
import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useEffect } from "react";

const ListWallets: NextPage = () => {
  const { proxyWallets, isLoading, error, getWallets } = useVectis();
  const { t } = useTranslations();
  const { balance, refreshBalance } = useBalance();

  useEffect(() => {
    getWallets();
  }, []);

  return (
    <>
      <Head>
        <title>Vectis | Wallets</title>
      </Head>

      <ConnectWallet>
        <h1 className="text-5xl text-center font-bold my-8">Your Smart Contract Wallets</h1>

        {isLoading ? (
          <Loader>Querying your Smart Contract Wallets...</Loader>
        ) : (
          <>
            {proxyWallets.length === 0 && (
              <h1 className="text-xl text-center">
                You don't own a Smart Contract Wallet.
                <br />
                Create your first one by clicking the button below!
              </h1>
            )}
            <div className="grid grid-cols-[repeat(auto-fit,_minmax(384px,_1fr))] w-full p-4 gap-6 max-w-[80%]">
              {proxyWallets.map((address) => (
                <SCWCard key={address} address={address} onRefresh={refreshBalance} />
              ))}
            </div>
          </>
        )}

        <Link href="/wallets/create" passHref={true}>
          <button data-testid="create-wallet" className="btn btn-primary text-xl rounded-full my-10">
            {t("create.wallet")}
          </button>
        </Link>

        {error && (
          <div className="my-5">
            <AlertError>
              Failed to retrieve your Smart Contract Wallets.
              <br />
              {error.message}
            </AlertError>
          </div>
        )}
      </ConnectWallet>
    </>
  );
};

export default ListWallets;
