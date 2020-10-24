import { GetServerSidePropsContext } from "next";
import Buddy from "../containers/Buddy";

export const getServerSideProps = (ctx: GetServerSidePropsContext) => {
  if (!ctx.req.headers.cookie) {
    ctx.res.setHeader("location", "/login?goTo=/profile");
    ctx.res.statusCode = 302;
    ctx.res.end();
  }

  return { props: {} };
};

export default () => <Buddy />;
