import type { NextPage } from "next";
import { useBalance } from "hooks/useBalance";
import WalletLoader from "components/WalletLoader";
import Head from "next/head";
import SCWManageForm from "components/SCWManageForm";
import { useRouter } from "next/router";

const ManageWallet: NextPage = () => {
  const { balance, refreshBalance } = useBalance();
  const router = useRouter();
  const { address: proxyWalletAddress } = router.query;

  return (
    <>
      <Head>
        <title>Vectis | Manage Wallet</title>
      </Head>
      <WalletLoader>
        <p className="text-2xl mt-5">Your personal wallet has {balance}</p>

        <SCWManageForm proxyWalletAddress={proxyWalletAddress! as string} onRefresh={refreshBalance} />
      </WalletLoader>
    </>
  );
};

export default ManageWallet;