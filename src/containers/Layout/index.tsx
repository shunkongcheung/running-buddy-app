import React, { memo, ReactNode } from "react";

import NavBar from "./NavBar";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <main>
      <NavBar />
      {children}
    </main>
  );
};

export default memo(Layout);
