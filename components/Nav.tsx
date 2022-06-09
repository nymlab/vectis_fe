import { useCosmWasmClient } from "contexts/cosmwasm";
import Link from "next/link";
import Image from "next/image";
import ThemeToggle from "components/ThemeToggle";

function Nav() {
  const { address, connectWallet, disconnect } = useCosmWasmClient();
  const handleConnect = () => {
    if (!address.length) {
      connectWallet();
    } else {
      disconnect();
    }
  };

  const PUBLIC_SITE_ICON_URL = "";

  return (
    <div className="border-b w-screen px-2 md:px-16">
      <nav className="flex flex-wrap text-center md:text-left md:flex flex-row w-full justify-between items-center py-4 ">
        <div className="flex items-center">
          <Link href="/">
            <a>
              {PUBLIC_SITE_ICON_URL.length > 0 ? (
                <Image src={PUBLIC_SITE_ICON_URL} height={32} width={32} alt="Logo" />
              ) : (
                <span className="text-2xl">⚛️ </span>
              )}
            </a>
          </Link>
          <Link href="/">
            <a className="ml-1 md:ml-2 link link-hover font-semibold text-xl md:text-2xl align-top">{""}</a>
          </Link>
        </div>
        <ThemeToggle />
        <div className="flex flex-grow lg:flex-grow-0 max-w-full">
          <button
            className="block btn btn-outline btn-primary w-full max-w-full truncate tooltip"
            onClick={handleConnect}
            data-testid="wallet-nav-button"
          >
            {address || "Connect Wallet"}
          </button>
        </div>
      </nav>
    </div>
  );
}

export default Nav;
