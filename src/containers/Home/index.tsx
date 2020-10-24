import React, { memo } from "react";
import { useRouter } from "next/router";
import firebase from "firebase";
import { Alert } from "reactstrap";

interface HomeProps {}

const Home: React.FC<HomeProps> = () => {
  const router = useRouter();
  React.useEffect(() => {
    if (!firebase.auth().currentUser) router.push("/login");
  }, [router]);
  return (
    <>
      <Alert color="primary">Everything is Great</Alert>
    </>
  );
};

export default memo(Home);
