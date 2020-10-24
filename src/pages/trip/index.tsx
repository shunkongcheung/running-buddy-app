import Trip from "../../containers/Trip";
import { useFirebaseAuthReady } from "../../hooks";

export default () => {
  const ready = useFirebaseAuthReady();
  if (!ready) return <></>;

  return <Trip />;
};
