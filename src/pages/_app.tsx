import type { AppProps /*, AppContext */ } from "next/app";
import Head from "next/head";
import firebase from "firebase/app";
import { FirebaseAuthProvider } from "@react-firebase/auth";

import { UserContext, useUserProvider } from "../contexts/userContext";
import Layout from "../containers/Layout";

import "firebase/auth";
import "firebase/firestore";
import "bootstrap/dist/css/bootstrap.min.css";

const config = {
  apiKey: "AIzaSyC_GSZ5S9C_6NH0mOOW7TJMJjhrUW3-h_g",
  authDomain: "running-bubble-app.firebaseapp.com",
  databaseURL: "https://running-bubble-app.firebaseio.com",
  projectId: "running-bubble-app",
  storageBucket: "running-bubble-app.appspot.com",
  messagingSenderId: "110065026552",
  appId: "1:110065026552:web:452714be778015d419c20d",
};

function MyApp({ Component, pageProps }: AppProps) {
  const userContext = useUserProvider();
  return (
    <FirebaseAuthProvider firebase={firebase} {...config}>
      <UserContext.Provider value={userContext}>
        <Head>
          <title>Create Next App</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <Layout>
          <Component {...pageProps} />
        </Layout>
      </UserContext.Provider>
    </FirebaseAuthProvider>
  );
}

export default MyApp;
