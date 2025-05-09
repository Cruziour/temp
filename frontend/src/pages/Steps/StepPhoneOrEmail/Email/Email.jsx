import React, { useState } from 'react';
import Card from '../../../../components/shared/Card/Card';
import Button from '../../../../components/shared/Button/Button';
import TextInput from '../../../../components/shared/TextInput/TextInput';

const Email = ({ onNext }) => {
  const [email, setEmail] = useState('');
  return (
    <div className="flex justify-center items-center">
      <Card icon={'email-emoji'} title={'Enter your email id'}>
        <div className="mt-8 container">
          <TextInput
            placeholder={'your_email@gmail.com'}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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

export default Email;
