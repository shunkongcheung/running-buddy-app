import Buddy from "../containers/Buddy";
import { useFirebaseAuthReady } from "../hooks";

export default () => {
  const ready = useFirebaseAuthReady();
  if (!ready) return <></>;

  return <Buddy />;
};
