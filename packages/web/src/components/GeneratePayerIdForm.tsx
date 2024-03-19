import Button from "@mui/material/Button";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import Grid from "@mui/material/Grid";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import { emitter, useMainContext } from "../context";
import { useCallback, useState } from "react";
import { v4 as uuidv4 } from 'uuid';


export function GeneratePayerId() {
    const mainContext = useMainContext();
    const [payerId, setPayerId] = useState<string>("none");

    const generatePayerId = useCallback(() => {
        const id = uuidv4();
        setPayerId(id);
        mainContext.payerId = id;
        emitter.emit('enableNext', true);
      }, []); 

    return (
        <FormGroup>
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <TextField
                        fullWidth 
                        disabled
                        id="outlined-disabled"
                        label="Payer ID"
                        value={payerId}
                    />
                </Grid>
                <Grid item xs={6}>
                    <Button fullWidth onClick={generatePayerId} variant="outlined">generate random payer Id</Button>
                </Grid>
                <Grid item xs={12}>
                    <FormControlLabel control={<Switch onChange={mainContext.handleOptIn} checked={(mainContext.optIn || false)} />} label="Opt in for one-click transactions on any device browser" />
                </Grid>
            </Grid>
        </FormGroup>
    )
}
