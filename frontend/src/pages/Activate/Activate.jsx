import React, { useState } from 'react';
import { StepAvatar, StepName } from '../Steps';

const steps = {
  1: StepName,
  2: StepAvatar,
};
const Activate = () => {
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

export default Activate;
