import React from 'react'
import Button from '../../../components/shared/Button/Button';

const StepPhoneOrEmail = ({ onNext }) => {
  return (
    <>
      <p>StepPhoneOrEmail</p>
      <Button btnText={'Next'} onClick={onNext} />
    </>
  );
};

export default StepPhoneOrEmail
