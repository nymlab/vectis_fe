import "styles/globals.css";
import type { AppProps } from "next/app";
import { Layout } from "components/Layout";
import { SigningCosmWasmProvider } from "contexts/cosmwasm";
import { VectisProvider } from "contexts/vectis";
import { Toaster } from "react-hot-toast";

function VectisApp({ Component, pageProps }: AppProps) {
  return (
    <SigningCosmWasmProvider>
      <VectisProvider>
        <Layout>
          <Component {...pageProps} />
          <Toaster position="top-center" reverseOrder={false} />
        </Layout>
      </VectisProvider>
    </SigningCosmWasmProvider>
  );
}
export default VectisApp;
