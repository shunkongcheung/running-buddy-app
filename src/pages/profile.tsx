import Profile from "../containers/Profile";
import { useFirebaseAuthReady } from "../hooks";

export default () => {
  const ready = useFirebaseAuthReady();
  if (!ready) return <></>;

  return <Profile />;
};
