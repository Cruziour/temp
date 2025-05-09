import React, { useState } from 'react';
import Card from '../../../../components/shared/Card/Card';
import Button from '../../../../components/shared/Button/Button';
import TextInput from '../../../../components/shared/TextInput/TextInput';

const Phone = ({ onNext }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  return (
    <div className="flex justify-center items-center">
      <Card icon={'phone'} title={'Enter your phone number'}>
        <div className="mt-8 container">
          <TextInput
            placeholder={'1234567890'}
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
          <div className="flex justify-center mt-8">
            <div>
              <Button btnText={`Next`} onClick={onNext} />
            </div>
          </div>
          <div className="flex justify-center text-gray-400">
            <p className="mt-4 w-72 text-sm">
              By entering your number or email, you’re agreeing to our Terms of
              Service and Privacy Policy. Thanks!
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Phone;
