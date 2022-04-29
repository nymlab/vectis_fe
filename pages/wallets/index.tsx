import { AlertError } from "components/Alert";
import Loader from "components/Loader";
import SCWCard from "components/SCWCard";
import WalletLoader from "components/WalletLoader";
import { useVectis } from "contexts/vectis";
import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useEffect } from "react";

const ListWallets: NextPage = () => {
  const { proxyWallets, loading, error } = useVectis();

  useEffect(() => {
    if (!proxyWallets?.length) {
      return;
    }
  }, [proxyWallets]);

  return (
    <>
      <Head>
        <title>Vectis | Wallets</title>
      </Head>
      <WalletLoader>
        <p className="text-3xl my-10">Your Smart Contract Wallets</p>

        {loading ? (
          <Loader>Querying your Smart Contract Wallets...</Loader>
        ) : (
          proxyWallets.map((address, i) => (
            <SCWCard
              key={i}
              title={`Smart Contract Wallet #${i + 1}`}
              address={address}
            />
          ))
        )}

        <Link href="/wallets/create" passHref={true}>
          <button className="btn btn-primary text-xl rounded-full my-10">
            Create new wallet
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
      </WalletLoader>
    </>
  );
};

export default ListWallets;
