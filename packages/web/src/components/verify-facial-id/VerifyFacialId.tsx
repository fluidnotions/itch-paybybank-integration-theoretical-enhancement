import { Button, CircularProgress, Typography } from "@mui/material";
import { CaptureFacialId } from "..";
import { useCallback, useEffect, useState } from "react";
import "./styles.css";
import { emitter, useMainContext } from "../../context";

export function VerifyFacialId() {
  const [isVerificationInProgress, setIsVerificationInProgress] =
    useState(false);
  const [isVerified, setIsVerified] = useState<number>(0);
  const [duration, setDuration] = useState<string>("?");
  const [isCaptureDone, setIsCaptureDone] = useState(false);
  const mainContext = useMainContext();

  useEffect(() => {
    if (isVerified === 1) {
      emitter.emit("enableNext", true);
    }
  }, [isVerified]);

  const verify = useCallback(() => {
    let start = -1,
      end = 0;
    setIsVerificationInProgress(true);
    const verify = async () => {
      start = parseInt(String(performance.now()));
      const result = await mainContext.selfieVerified();
      end = parseInt(String(performance.now()));
      const diff = (end - start) / 1000;
      setDuration(diff.toFixed(1));
      console.log({ start, end });
      setIsVerificationInProgress(false);
      setIsVerified(result ? 1 : 2);
    };

    verify().catch(console.error);
  }, [isVerificationInProgress]);

  const retry = () => {
    setIsVerificationInProgress(false);
    setIsVerified(0);
    setIsCaptureDone(false);
  };

  const captureDone = (done: boolean) => {
    setIsCaptureDone(done);
  };

  return (
    <>
      {(!isVerificationInProgress && isVerified === 0 && (
        <>
          <CaptureFacialId captureDone={captureDone} />
          {isCaptureDone && (
            <Button fullWidth onClick={verify} variant="outlined">
              verify
            </Button>
          )}
        </>
      )) ||
        (isVerified === 0 && <CircularProgress className="progress" />)}
      {isVerified === 1 && (
        <Typography className="result success" component="h2">
          Facial ID verified {`(in ${duration} seconds.)`}
        </Typography>
      )}
      {isVerified === 2 && (
        <>
          <Typography className="result failure" component="h2">
            Facial ID not verified {`(in ${duration} seconds.)`}
          </Typography>
          <Button fullWidth onClick={retry} variant="outlined">
            retry
          </Button>
        </>
      )}
    </>
  );
}
