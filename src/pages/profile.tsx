import { GetServerSidePropsContext } from "next";
import Profile from "../containers/Profile";

export const getServerSideProps = (ctx: GetServerSidePropsContext) => {
  if (!ctx.req.headers.cookie) {
    ctx.res.setHeader("location", "/login?goTo=/profile");
    ctx.res.statusCode = 302;
    ctx.res.end();
  }

  return { props: {} };
};

export default () => <Profile />;
