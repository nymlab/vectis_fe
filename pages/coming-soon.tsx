import { Anchor } from "components/Anchor";
import ThemeToggle from "components/ThemeToggle";
import VectisLogo from "components/VectisLogo";
import { ReactElement } from "react";
import { NextPageWithLayout } from "./_app";
import { socialsLinks, links } from "utils/links";

const ComingSoon: NextPageWithLayout = () => {
  return (
    <>
      <div className="h-screen flex flex-col items-center justify-center">
        <VectisLogo contrast />
        <h1 className="text-5xl font-bold my-10">
          Coming soon on{" "}
          <a href="https://www.junonetwork.io/" className="link link-hover hover:text-primary">
            Juno
          </a>{" "}
          mainnet!
        </h1>
        <div>
          <h1 className="text-3xl font-bold mb-2">What is Vectis?</h1>
          <div className="max-w-xl text-justify">
            <h2 className="text-2xl mb-5">
              A non-custodial smart contract wallet project to enhance DApp user experience; it supports social recovery, guardianship and
              relaying capability for gas provisioning and auditability. For more details, please see our{" "}
              <a href="https://github.com/nymlab/vectis/#overview" className="link link-primary link-hover">
                documentation
              </a>
              .
            </h2>
          </div>
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-2">When is it releasing?</h1>
          <div className="max-w-xl text-justify">
            <h2 className="text-2xl mb-16">
              We are close to launching on Juno mainnet.
              <br />
              If you are interested in the project, join our community on{" "}
              <a href={links.discord} className="link link-hover link-primary" target="_blank">
                Discord
              </a>
              . You can also check out the preview on Juno testnet at the following link:{" "}
              <a href="https://testnet.vectis.nymlab.it/" className="link link-hover link-primary">
                https://testnet.vectis.nymlab.it
              </a>
            </h2>
          </div>
        </div>
        <div className="space-x-10 flex align-middle justify-center">
          {socialsLinks.map(({ Icon, href, text }) => (
            <Anchor key={href} href={href} className="hover:text-gray-300">
              <Icon aria-label={text} size={36} />
            </Anchor>
          ))}
          <ThemeToggle size={36} />
        </div>
      </div>
    </>
  );
};

ComingSoon.getLayout = function getLayout(page: ReactElement) {
  return <>{page}</>;
};

export default ComingSoon;
