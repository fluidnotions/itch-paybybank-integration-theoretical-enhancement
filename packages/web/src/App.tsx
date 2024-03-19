import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import { HorizontalLinearStepper } from "./components";
import { ReactMainContext, useMainContext } from "./context";
import { useLayoutEffect } from "react";

function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="">
        Itch PayByBank Integration Theoretical Enhancement MRE
      </Link>{" "}
      {new Date().getFullYear()}.
    </Typography>
  );
}

function App() {
  const mainContext = useMainContext();

  useLayoutEffect(() => {
    const init = async () => {
      await mainContext.init();
    };
    init();
  });

  const Provider = ReactMainContext.Provider;
  return (
    <Provider value={mainContext}>
      <HorizontalLinearStepper />
      <Copyright />
    </Provider>
  );
}

export default App;
