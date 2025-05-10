import React, { useState } from 'react';
import Button from '../../../components/shared/Button/Button';
import Card from '../../../components/shared/Card/Card';
import TextInput from '../../../components/shared/TextInput/TextInput';
import { verifyOtpService } from '../../../services';
import { useDispatch, useSelector } from 'react-redux';
import { setAuth } from '../../../redux/slice/authSlice';

const StepOtp = () => {
  const [otp, setOtp] = useState('');
  const dispatch = useDispatch();
  const { phone, hash, expires } = useSelector((state) => state.authSlice.otp);

  const submit = async () => {
    try {
      const { data } = await verifyOtpService({ phone, otp, hash, expires });
      dispatch(setAuth(data));
    } catch (error) {
      console.log(error, 'stepOtp.jsx');
    }
  };
  return (
    <div className="flex justify-center items-center mt-20 container">
      <Card title={'Enter the code we just texted you'} icon={'lock-emoji'}>
        <div className='mt-8'>
          <TextInput
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder={'2222'}
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

export default StepOtp;
