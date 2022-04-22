import { AlertError } from "components/Alert";
import WalletLoader from "components/WalletLoader";
import { useVectis } from "contexts/vectis";
import type { NextPage } from "next";
import Head from "next/head";
import { useEffect } from "react";
import { queryVectisWalletInfo } from "services/vectis";

const ListWallets: NextPage = () => {
  const { proxyWallets, error } = useVectis();

  useEffect(() => {
    if (!proxyWallets?.length) {
      return;
    }
    console.log(proxyWallets);

    queryVectisWalletInfo(proxyWallets[0]);
  }, [proxyWallets]);

  return (
    <>
      <Head>
        <title>Vectis | Wallets</title>
      </Head>
      <WalletLoader>
        <p className="text-3xl my-10">Your Smart Contract Wallets</p>

        {proxyWallets.map((address) => (
          <button
            key={address}
            className="btn btn-primary font-light hover:text-base-100 rounded-full"
          >
            {address}
          </button>
        ))}

        {error && (
          <div className="my-5">
            <AlertError>
              Failed to retrieve your Smart Contract Wallets.
              <br />
              {error.message}
            </AlertError>
          </div>
        )}
      </WalletLoader>
    </>
  );
};

export default ListWallets;
