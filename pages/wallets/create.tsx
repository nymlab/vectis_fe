import type { NextPage } from "next";
import { useBalance } from "hooks/useBalance";
import WalletLoader from "components/WalletLoader";
import SCWCreateForm from "components/SCWCreateForm";
import Head from "next/head";

const CreateWallet: NextPage = () => {
  const { balance } = useBalance();

  return (
    <>
      <Head>
        <title>Vectis | Create Wallet</title>
      </Head>
      <WalletLoader>
        <p className="text-2xl">Your personal wallet has {balance}</p>

        <SCWCreateForm/>
      </WalletLoader>
    </>
  );
};

export default CreateWallet;
