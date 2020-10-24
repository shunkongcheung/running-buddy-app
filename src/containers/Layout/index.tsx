import React, { memo, ReactNode } from "react";
import { useRouter } from "next/router";
import firebase from "firebase";

import NavBar from "./NavBar";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { pathname } = useRouter();
  const [displayName, setDisplayName] = React.useState("");

  React.useEffect(() => {
    const { displayName } = firebase.auth().currentUser || {};
    setDisplayName(displayName);
  }, [pathname]);

  return (
    <main>
      <NavBar displayName={displayName} />
      {children}
    </main>
  );
};

export default memo(Layout);
