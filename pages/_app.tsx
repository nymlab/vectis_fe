import "styles/globals.css";
import type { AppProps } from "next/app";
import Layout from "components/Layout";
import { SigningCosmWasmProvider } from "contexts/cosmwasm";
import { VectisProvider } from "contexts/vectis";

function VectisApp({ Component, pageProps }: AppProps) {
  return (
    <SigningCosmWasmProvider>
      <VectisProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </VectisProvider>
    </SigningCosmWasmProvider>
  );
}
export default VectisApp;
