import { useEffect, useRef, useState } from "react";

const initialTime = new Date();
function useRunningTime(started: boolean) {
  const [{ startTime, curTime }, setTime] = useState({
    startTime: initialTime,
    curTime: initialTime,
  });

  const clearRef = useRef<number>();

  useEffect(() => {
    if (started) {
      const time = new Date();
      setTime({
        startTime: time,
        curTime: time,
      });
      clearRef.current = setInterval(() => {
        setTime((o) => ({ ...o, curTime: new Date() }));
      }, 1000) as any;
    } else {
      setTime({ startTime: initialTime, curTime: initialTime });
      clearInterval(clearRef.current);
    }

    return () => {
      clearInterval(clearRef.current);
    };
  }, [started]);

  const totalSec = (curTime.getTime() - startTime.getTime()) / 1000;
  const hours = Math.floor(totalSec / 3600);
  const minutes = Math.floor(totalSec / 60) - hours * 60;
  const seconds = totalSec - hours * 3600 - minutes * 60;

  const fm = (num: number) => num.toFixed(0).padStart(2, "0");

  return `${hours ? `${fm(hours)}:` : ""}${fm(minutes)}:${fm(seconds)}`;
}

export default useRunningTime;
