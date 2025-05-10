import React, { useState } from 'react';
import Card from '../../../../components/shared/Card/Card';
import Button from '../../../../components/shared/Button/Button';
import TextInput from '../../../../components/shared/TextInput/TextInput';
import { sendOtpService } from '../../../../services';
import { useDispatch } from 'react-redux';
import { setOtp } from '../../../../redux/slice/authSlice';

const Phone = ({ onNext }) => {
  const [phone, setPhone] = useState('');
  const dispatch = useDispatch();

  const submit = async () => {
    try {
      const { data } = await sendOtpService({ phone });
      console.log(data, 'otpPhonec')
      dispatch(
        setOtp({ phone: data?.phone, hash: data?.hash, expires: data?.expires })
      );
      onNext();
    } catch (error) {
      console.log(error, 'Phone.jsx');
    }
  };

  return (
    <div className="flex justify-center items-center">
      <Card icon={'phone'} title={'Enter your phone number'}>
        <div className="mt-8 container">
          <TextInput
            placeholder={'1234567890'}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <div className="flex justify-center mt-8">
            <div>
              <Button btnText={`Next`} onClick={submit} />
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
