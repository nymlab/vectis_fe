import { AlertError } from "components/Alert";
import Loader from "components/Loader";
import SCWCard from "components/SCWCard";
import WalletLoader from "components/WalletLoader";
import { useVectis } from "contexts/vectis";
import { useBalance } from "hooks/useBalance";
import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

const ListWallets: NextPage = () => {
  const { proxyWallets, loading, error } = useVectis();
  const { balance } = useBalance();

  return (
    <>
      <Head>
        <title>Vectis | Wallets</title>
      </Head>
      <WalletLoader>
        <p className="text-2xl mt-5">Your personal wallet has {balance}</p>
        <h1 className="text-5xl font-bold my-8">Your Smart Contract Wallets</h1>

        {loading ? (
          <Loader>Querying your Smart Contract Wallets...</Loader>
        ) : (
          <div className="flex flex-col md:flex-row">
            {proxyWallets.map((address, i) => (
              <div key={i} className="m-5">
                <SCWCard title={`Smart Contract Wallet`} address={address} />
              </div>
            ))}
          </div>
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