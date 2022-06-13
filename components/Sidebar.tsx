import React from "react";
import clsx from "clsx";
import { Anchor } from "./Anchor";
import { useRouter } from "next/router";
import { links, socialsLinks } from "utils/links";

import { SidebarLayout } from "./SidebarLayout";
import { WalletLoader } from "./WalletLoader";
import VectisLogo from "./VectisLogo";
import { useCosm } from "contexts/cosmwasm";

const routes = [
  { text: "Wallets", href: "/wallets" },
  { text: "Guardian View", href: "/guardian" },
  { text: "Validators", href: "/validators" },
];

const Sidebar: React.FC = () => {
  const router = useRouter();
  const { network } = useCosm();

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
            "hover:bg-gray-800 rounded-lg transition-colors text-white", // hover styling
            { "font-bold text-white dark": router.asPath.startsWith(href) } // active route styling
            // { 'text-gray-500 pointer-events-none': disabled }, // disabled route styling
          )}
          href={href}
        >
          {text}
        </Anchor>
      ))}

      <div className="flex-grow" />

      {/* juno network status */}
      <div className="text-sm text-white">Network: {network?.chainName}</div>
      <div className="align-center"></div>

      {/* footer reference links */}
      <ul className="text-sm list-disc list-inside">
        {[].map(({ href, text }) => (
          <li key={href}>
            <Anchor className="hover:text-white hover:underline" href={href}>
              {text}
            </Anchor>
          </li>
        ))}
      </ul>

      {/* footer attribution */}
      <div className="text-xs text-white/50">
        Vectis {process.env.APP_VERSION} <br />
        Made by{" "}
        <Anchor className="text-white hover:underline" href={links.nymlab}>
          <span className="font-bold">Nymlab</span>
        </Anchor>
      </div>
      {/* footer social links */}
      <div className="flex gap-x-6 items-center justify-center text-white/75">
        {socialsLinks.map(({ Icon, href, text }) => (
          <Anchor key={href} className="hover:text-white" href={href}>
            <Icon aria-label={text} size={20} />
          </Anchor>
        ))}
      </div>
    </SidebarLayout>
  );
};

export default Sidebar;
