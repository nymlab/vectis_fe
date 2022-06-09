import React from "react";
import clsx from "clsx";
import { Anchor } from "./Anchor";
import { useRouter } from "next/router";
import { links } from "utils/links";

import { SidebarLayout } from "./SidebarLayout";
import ThemeToggle from "./ThemeToggle";
import { WalletLoader } from "./WalletLoader";
import VectisLogo from "./VectisLogo";
import { useCosmWasmClient } from "contexts/cosmwasm";

const routes = [{ text: "Validators", href: `/validators` }];

const Sidebar: React.FC = () => {
  const router = useRouter();
  const { network } = useCosmWasmClient();

  return (
    <SidebarLayout>
      <Anchor href="/" onContextMenu={(e) => [e.preventDefault(), router.push("/brand")]}>
        <VectisLogo />
      </Anchor>

      <WalletLoader />

      {/* main navigation routes */}
      {routes.map(({ text, href }) => (
        <Anchor
          key={href}
          className={clsx(
            "py-2 px-4 -mx-4 uppercase", // styling
            "hover:bg-white/5 transition-colors", // hover styling
            { "font-bold text-plumbus": router.asPath.startsWith(href) } // active route styling
            // { 'text-gray-500 pointer-events-none': disabled }, // disabled route styling
          )}
          href={href}
        >
          {text}
        </Anchor>
      ))}

      <div className="flex-grow" />

      {/* juno network status */}
      <div className="text-sm">Network: {network?.chainName}</div>
      <div className="align-center">
        <ThemeToggle />
      </div>
      {/* footer reference links */}
      <ul className="text-sm list-disc list-inside">
        {[].map(({ href, text }) => (
          <li key={href}>
            <Anchor className="hover:text-plumbus hover:underline" href={href}>
              {text}
            </Anchor>
          </li>
        ))}
      </ul>

      {/* footer attribution */}
      <div className="text-xs text-white/50">
        Vectis Wallet {process.env.APP_VERSION} <br />
        Made by{" "}
        <Anchor className="text-plumbus hover:underline" href={links.nymlab}>
          <span className="font-bold">Nymlab</span>
        </Anchor>
      </div>

      {/* footer social links */}
      <div className="flex gap-x-6 items-center text-white/75">
        {[].map(({ Icon, href, text }) => (
          <Anchor key={href} className="hover:text-plumbus" href={href}>
            {/* <Icon aria-label={text} size={20} /> */}
          </Anchor>
        ))}
      </div>
    </SidebarLayout>
  );
};

export default Sidebar;
