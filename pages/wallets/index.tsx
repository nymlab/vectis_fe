import { AlertError } from "components/Alert";
import Loader from "components/Loader";
import SCWCard from "components/SCWCard";
import { useVectis } from "contexts/vectis";
import { useBalance } from "hooks/useBalance";
import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useEffect } from "react";

const ListWallets: NextPage = () => {
  const { proxyWallets, isLoading, error, getWallets } = useVectis();
  const { balance, refreshBalance } = useBalance();

  useEffect(() => {
    getWallets();
  }, []);

  return (
    <>
      <Head>
        <title>Vectis | Wallets</title>
      </Head>

      <p className="text-2xl mt-5">Your personal wallet has {balance}</p>
      <h1 className="text-5xl font-bold my-8">Your Smart Contract Wallets</h1>

      {isLoading ? (
        <Loader>Querying your Smart Contract Wallets...</Loader>
      ) : (
        <div className={`flex flex-col md:grid`} style={{ gridTemplateColumns: `repeat(${Math.min(proxyWallets.length, 3)}, minmax(0, 1fr))` }}>
          {proxyWallets.map((address, i) => (
            <div key={i} className="m-5">
              <SCWCard address={address} onRefresh={refreshBalance} />
            </div>
          ))}
        </div>
      )}

      <Link href="/wallets/create" passHref={true}>
        <button className="btn btn-primary text-xl rounded-full my-10">Create new wallet</button>
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
    </>
  );
};

export default ListWallets;
