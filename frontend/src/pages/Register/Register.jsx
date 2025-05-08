import React, { useState } from 'react';
import {
  StepAvatar,
  StepName,
  StepOtp,
  StepPhoneOrEmail,
  StepUsername,
} from '../Steps/index';

const steps = {
  1: StepPhoneOrEmail,
  2: StepOtp,
  3: StepName,
  4: StepAvatar,
  5: StepUsername,
};

const Register = () => {
  const [step, setStep] = useState(1);
  const Step = steps[step];

  const onNext = () => {
    setStep((prev) => prev + 1);
  }

  return (
    <div>
      <Step onNext={onNext} />
    </div>
  );
};

export default Register;
