import React from 'react'
import Button from '../../../components/shared/Button/Button';

const StepOtp = ({ onNext }) => {
  return (
    <>
      <p>StepOtp</p>
      <Button btnText={'Next'} onClick={onNext} />
    </>
  );
};

export default StepOtp
