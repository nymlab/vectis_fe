import type { NextPage } from "next";
import { useBalance } from "hooks/useBalance";
import SCWCreateForm from "components/SCWCreateForm";
import Head from "next/head";
import ConnectWallet from "components/ConnectWallet";

const CreateWallet: NextPage = () => {
  const { balance, refreshBalance } = useBalance();

  return (
    <>
      <Head>
        <title>Vectis | Create Wallet</title>
      </Head>

      <ConnectWallet>
        <SCWCreateForm onRefresh={refreshBalance} />
      </ConnectWallet>
    </>
  );
};

export default CreateWallet;
