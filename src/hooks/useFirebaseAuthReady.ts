import { useEffect, useState } from "react";
import firebase from "firebase";
import { useRouter } from "next/router";

function useFirebaseAuthReady() {
  const router = useRouter();
  const { pathname } = router;
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (ready) return;

    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        setReady(true);
      } else {
        router.push(`/login?toTo=${pathname}`);
      }

      return () => {
        unsubscribe();
      };
    });
  }, [router, pathname]);

  return ready;
}

export default useFirebaseAuthReady;
