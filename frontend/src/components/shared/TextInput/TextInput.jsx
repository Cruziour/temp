import React from 'react';

const TextInput = ({type='text', ...props}) => {
  return (
    <div>
      <input
        type={type}
        {...props}
        className="py-1 px-4 w-60 text-white text-md rounded-xl outline-none"
        style={{ background: '#323232' }}
      />
    </div>
  );
};

export default TextInput;
