import type { NextPage } from "next";
import { useBalance } from "hooks/useBalance";
import SCWCreateForm from "components/SCWCreateForm";
import Head from "next/head";

const CreateWallet: NextPage = () => {
  const { balance, refreshBalance } = useBalance();

  return (
    <>
      <Head>
        <title>Vectis | Create Wallet</title>
      </Head>

      <p className="text-2xl mt-5">Your personal wallet has {balance}</p>

      <SCWCreateForm onRefresh={refreshBalance} />
    </>
  );
};

export default CreateWallet;
