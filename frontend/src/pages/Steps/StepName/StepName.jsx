import React from 'react'
import Button from '../../../components/shared/Button/Button';

const StepName = ({ onNext }) => {
  return (
    <>
      <p>StepName</p>
      <Button btnText={'Next'} onClick={onNext} />
    </>
  );
};

export default StepName
