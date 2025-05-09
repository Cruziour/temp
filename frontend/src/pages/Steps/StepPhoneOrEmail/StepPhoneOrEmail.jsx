import React, { useState } from 'react';
import Phone from './Phone/Phone';
import Email from './Email/Email';

const phoneEmailMap = {
  phone: Phone,
  email: Email,
};

const StepPhoneOrEmail = ({ onNext }) => {
  const [type, setType] = useState('phone');
  const Component = phoneEmailMap[type];

  return (
    <>
      <div className="container flex justify-center mt-20">
        <div>
          <div className="mb-3 flex gap-x-2 justify-end w-[500px] max-w-[90%]">
            <button
              onClick={() => setType('phone')}
              className="cursor-pointer w-[60px] h-[60px] flex justify-center items-center border-none rounded-2xl"
              style={
                type === 'phone'
                  ? { background: '#0000FF' }
                  : { background: '#1D1D1D' }
              }
            >
              <img src="/images/phone-white.png" alt="phone" className='w-7 h-7' />
            </button>
            <button
              onClick={() => setType('email')}
              className="cursor-pointer w-[60px] h-[60px] flex justify-center items-center border-none rounded-2xl"
              style={
                type === 'email'
                  ? { background: '#0000FF' }
                  : { background: '#1D1D1D' }
              }
            >
              <img src="/images/mail-white.png" alt="email" className='w-6 h-6' />
            </button>
          </div>
          <Component onNext={onNext} />
        </div>
      </div>
    </>
  );
};

export default StepPhoneOrEmail;
