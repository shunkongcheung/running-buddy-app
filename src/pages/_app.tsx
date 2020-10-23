import type { AppProps /*, AppContext */ } from "next/app";
import Head from "next/head";
import "bootstrap/dist/css/bootstrap.min.css";

import { UserContext, useUserProvider } from "../contexts/userContext";
import Layout from "../containers/Layout";

function MyApp({ Component, pageProps }: AppProps) {
  const userContext = useUserProvider();
  return (
    <UserContext.Provider value={userContext}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Layout>
        <Component {...pageProps} />
      </Layout>
    </UserContext.Provider>
  );
}

export default MyApp;
