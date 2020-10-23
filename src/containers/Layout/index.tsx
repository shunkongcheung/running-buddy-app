import React, { memo, ReactNode } from "react";

import NavBar from "./NavBar";
import { useUserContext } from "../../contexts";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { displayName, clearToken } = useUserContext();
  return (
    <main>
      <NavBar displayName={displayName} handleLogout={clearToken} />
      {children}
    </main>
  );
};

export default memo(Layout);
