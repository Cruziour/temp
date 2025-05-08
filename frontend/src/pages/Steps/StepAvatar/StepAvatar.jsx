import React from 'react'
import Button from '../../../components/shared/Button/Button';

const StepAvatar = ({ onNext }) => {
  return (
    <>
      <p>StepAvatar</p>
      <Button btnText={'Next'} onClick={onNext} />
    </>
  );
};

export default StepAvatar
