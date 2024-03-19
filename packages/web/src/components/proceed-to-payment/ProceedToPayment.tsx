import { useEffect, useLayoutEffect, useState } from "react";
import { emitter, useMainContext } from "../../context";
import { Typography } from "@mui/material";


//FIXME: I'm a amazed an iframe works they usually don't for payment gateways
//maybe a little hacky but it works, and I hate popups and redirects out of the app
export function ProceedToPayment() {
  const [returning, setReturning] = useState(false);
  const [loadCount, setLoadCount] = useState(0);
  const mainContext = useMainContext();
  useLayoutEffect(() => {
    const wait = setInterval(() => {
      const iframe = document.getElementsByTagName("iframe")[0];
      if (iframe) {
        clearInterval(wait);
        iframe.addEventListener("load", () => {
          setLoadCount(loadCount + 1);
          console.log("The iframe has loaded #", loadCount);
          if (loadCount > 0) {
            setReturning(true);
          }
        });
      }
    }, 10);
  });
  useEffect(() => {
    if (returning) {
      emitter.emit("enableNext", true);
    }
  }, [returning]);
  return (
    <>
      <div className="iframe-container">
        {(!returning && (
          <iframe
            id="payment-iframe"
            src={mainContext.paymentRequestUrl!}
            width="700"
            height="700"
            style={{ border: "none" }}
          ></iframe>
        )) || (
          <Typography color="green" fontSize="30px" fontWeight="800" fontFamily="fantasy">
            All done !
          </Typography>
        )}
      </div>
    </>
  );
}
