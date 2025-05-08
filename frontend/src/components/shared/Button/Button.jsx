import React, { useId } from 'react';

const Button = ({ btnText, ...props }) => {
  const id = useId();
  return (
    <button
      {...props}
      id={id}
      className="flex justify-center items-center px-4 py-2 rounded-xl bg-blue-700 cursor-pointer font-bold gap-x-1 hover:bg-blue-800"
    >
      <span>{btnText}</span>
      <img src="/images/arrow-forward.png" alt="" />
    </button>
  );
};

export default Button;
