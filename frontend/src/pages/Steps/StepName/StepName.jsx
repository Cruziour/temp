import React, { useState } from 'react';
import Button from '../../../components/shared/Button/Button';
import Card from '../../../components/shared/Card/Card';
import TextInput from '../../../components/shared/TextInput/TextInput';
import { setName } from '../../../redux/slice/activateSlice';
import { useDispatch, useSelector } from 'react-redux';

const StepName = ({ onNext }) => {
  const dispatch = useDispatch();
  const { name } = useSelector((state) => state.activateSlice);
  const [fullName, setFullName] = useState(name);
  const nextStep = () => {
    if (!fullName) {
      alert('Please enter your name');
    }
    dispatch(setName(fullName.trim()));
    onNext();
  };
  return (
    <div className="flex justify-center items-center mt-20 container">
      <Card title={`What's your full name`} icon={'goggle-emoji'}>
        <div className='mt-8'>
          <TextInput
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder={'Your name'}
          />
          <div className="flex justify-center text-gray-400">
            <p className="mt-6 w-44 text-sm">
              People use real names at codershouse :)
            </p>
          </div>
          <div className="flex justify-center mt-8">
            <div>
              <Button btnText={`Next`} onClick={nextStep} />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default StepName;
