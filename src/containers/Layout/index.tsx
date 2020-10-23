import React, { memo, ReactNode } from "react";

import { useUserContext } from "../../contexts";
import NavBar from "./NavBar";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { displayName } = useUserContext();
  return (
    <main>
      <NavBar displayName={displayName} />
      {children}
    </main>
  );
};

export default memo(Layout);
