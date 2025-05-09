import React, { useState } from 'react';
import { StepOtp, StepPhoneOrEmail } from '../Steps/index';

const steps = {
  1: StepPhoneOrEmail,
  2: StepOtp,
};

const Authenticate = () => {
  const [step, setStep] = useState(1);
  const Step = steps[step];

  const onNext = () => {
    setStep((prev) => prev + 1);
  };

  return (
    <div>
      <Step onNext={onNext} />
    </div>
  );
};

export default Authenticate;
