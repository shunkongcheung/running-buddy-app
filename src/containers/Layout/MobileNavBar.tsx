import React, { memo } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { BsFillAlarmFill } from "react-icons/bs";

import classNames from "./MobileNavBar.module.css";

interface MobileNavBarProps {}

const MobileNavBar: React.FC<MobileNavBarProps> = () => {
  const routes = [
    { pathname: "/trip", displayName: "Trip", icon: <BsFillAlarmFill /> },
    { pathname: "/buddy", displayName: "Buddy", icon: <BsFillAlarmFill /> },
    { pathname: "/profile", displayName: "Profile", icon: <BsFillAlarmFill /> },
  ];
  const { pathname } = useRouter();

  const notShowing = pathname === "/login" || pathname === "/";
  if (notShowing) return <></>;

  return (
    <>
      <div className={classNames.padder} />
      <div className={classNames.container}>
        {routes.map((route, idx) => {
          const active = pathname.includes(route.pathname);
          return (
            <Link href={route.pathname}>
              <div
                className={`${classNames.routeContainer} ${
                  active ? classNames.active : ""
                }`}
                key={`MobileRoute-${route.pathname}-${idx}`}
              >
                {route.icon}
                <span className={classNames.routeName}>
                  {route.displayName}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
};

export default memo(MobileNavBar);
