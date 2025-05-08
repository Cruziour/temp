import React from 'react'
import Button from '../../../components/shared/Button/Button';

const StepUsername = ({ onNext }) => {
  return (
    <>
      <p>StepUsername</p>
      <Button btnText={'Next'} onClick={onNext} />
    </>
  );
};

export default StepUsername
