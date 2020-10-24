import TripDetail from "../../containers/TripDetail";
import { useFirebaseAuthReady } from "../../hooks";

export default () => {
  const ready = useFirebaseAuthReady();
  if (!ready) return <></>;

  return <TripDetail />;
};
