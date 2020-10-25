import React, { memo, ReactNode } from "react";
import { useRouter } from "next/router";
import firebase from "firebase/app";

import RequestAlert from "./RequestAlert";
import NavBar from "./NavBar";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { pathname } = useRouter();
  const [displayName, setDisplayName] = React.useState("");

  React.useEffect(() => {
    // listen to login / logout and update display name accordingly
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      setDisplayName(user?.displayName || "");
    });

    return () => {
      unsubscribe();
    };
  }, [pathname]);

  React.useEffect(() => {
    // every minutes, update last logged in time
    const interval = setInterval(() => {
      const uid = firebase.auth().currentUser?.uid;
      if (uid)
        firebase
          .firestore()
          .collection("registered-users")
          .doc(uid)
          .update({ lastLoggedInAt: new Date() });
    }, 1000 * 60);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <main>
      <NavBar displayName={displayName} />
      <RequestAlert />
      {children}
    </main>
  );
};

export default memo(Layout);
