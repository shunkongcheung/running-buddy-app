import React, {memo} from "react";
import Link from "next/link";
import {useRouter} from "next/router";

import classNames from "./MobileNavBar.module.css";
import {GiPathDistance, GiThreeFriends} from "react-icons/gi";
import {CgProfile} from "react-icons/cg";

interface MobileNavBarProps {
}

const MobileNavBar: React.FC<MobileNavBarProps> = () => {
  const routes = [
    {pathname: "/trip", displayName: "Trip", icon: <GiPathDistance className={classNames.fontColor}/>},
    {pathname: "/buddy", displayName: "Buddy", icon: <GiThreeFriends className={classNames.fontColor}/>},
    {pathname: "/profile", displayName: "Profile", icon: <CgProfile className={classNames.fontColor}/>},
  ];
  const {pathname} = useRouter();

  const notShowing = pathname === "/login" || pathname === "/";
  if (notShowing) return <></>;

  return (
      <>
        <div className={classNames.padder}/>
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
                    <span className={classNames.fontColor}>
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
