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
          <title>Running buddy app</title>
          <meta
            name="description"
            content="Schedule meetups with friends for running"
          />
          <meta name="keywords" content="running,exercise,meetup,community" />
          <meta name="author" content="quantum mobs" />
          <link rel="icon" href="/favicon.ico" />
          <link
            href="https://fonts.googleapis.com/css2?family=Roboto&display=swap"
            rel="stylesheet"
          />
        </Head>

        <Layout>
          <style jsx global>{`
            html,
            body {
              padding: 0;
              margin: 0;
              font-family: Roboto;
            }

            * {
              box-sizing: border-box;
            }
          `}</style>
          <Component {...pageProps} />
        </Layout>
      </UserContext.Provider>
    </FirebaseAuthProvider>
  );
}

export default MyApp;
