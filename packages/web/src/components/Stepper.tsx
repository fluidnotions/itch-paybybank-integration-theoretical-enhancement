import React, { useCallback, useEffect } from 'react';
import { useState } from 'react';
import { GeneratePayerId, EnrolFacialId, VerifyFacialId, ProceedToPayment, About } from '.';
import { Box, Button, CircularProgress, Step, StepLabel, Stepper, Typography } from '@mui/material';
import './styles.css'
import { emitter, useMainContext } from '../context';

const defaultSteps = ['About', 'Generate Payer Id', 'Proceed To Payment'];
const defaultStepComponents = [<About />, <GeneratePayerId />, <ProceedToPayment />];
const optInSteps = ['About', 'Generate Payer Id', 'Enrol Facial ID', 'Verify Facial ID', 'Proceed To Payment'];
const optInStepComponents = [<About />, <GeneratePayerId />, <EnrolFacialId />, <VerifyFacialId />, <ProceedToPayment />];

export function HorizontalLinearStepper() {
  const [activeStep, setActiveStep] = useState(0);
  const [steps, setSteps] = useState(defaultSteps);
  const [stepComponents, setStepComponents] = useState(defaultStepComponents as any);
  const [nextDisabled, setNextDisabled] = useState(activeStep > 0);
  const [initInProgress, setInitInProgress] = useState(false);
  const mainContext = useMainContext();


  useEffect(() => {
    const handleEvent = (enable: boolean) => {
      console.log('enableNext', enable);
      setNextDisabled(!enable)
    };
    emitter.on('enableNext', handleEvent);
    // Cleanup listener on component unmount
    return () => {
      emitter.off('enableNext', handleEvent);
    };
  }, []);

  mainContext.handleOptIn = useCallback(() => {
    if (!mainContext.optIn) {
      setSteps(optInSteps);
      setStepComponents(optInStepComponents);
      mainContext.optIn = true;
    } else {
      setSteps(defaultSteps);
      setStepComponents(defaultStepComponents);
      mainContext.optIn = false;
    }
  }, []);



  const handleNext = async () => {
    try {
      setInitInProgress(true)
      await mainContext.next(steps[activeStep + 1]);
    } finally {
      setInitInProgress(false)
    }
    setActiveStep((prevActiveStep) => {
      const activeIndex = prevActiveStep + 1;
      return activeIndex;
    });
    setNextDisabled(true)
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <Box sx={{ width: '80%', maxWidth: '1100px', margin: 'auto' }}>
      <Stepper activeStep={activeStep}>
        {steps.map((label) => {
          const stepProps: { completed?: boolean } = {};
          return (
            <Step key={label} {...stepProps}>
              <StepLabel>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      <div className="component">
        {!initInProgress && stepComponents[activeStep] || <CircularProgress />}
      </div>
      {activeStep === steps.length ? (
        <React.Fragment>
          <Typography component="h2" sx={{ mt: 2, mb: 1 }}>
            All steps completed - you&apos;re finished. Click 'reset' to give it another spin.
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            <Box sx={{ flex: '1 1 auto' }} />
            <Button variant="contained" onClick={handleReset}>Reset</Button>
          </Box>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            <Box sx={{ flex: '1 1 auto' }} />
            <Button variant="contained" onClick={handleNext} disabled={nextDisabled}>
              {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
            </Button>
          </Box>
        </React.Fragment>
      )}
    </Box>
  );
}

