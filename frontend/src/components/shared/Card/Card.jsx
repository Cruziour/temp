import React from 'react';

const Card = ({ title, icon, children }) => {
  return (
    <div
      className="w-[500px] max-w-[90%] min-h-[300px] p-4 rounded-2xl text-center"
      style={{ background: '#1D1D1D' }}
    >
      <div className="flex justify-center items-center gap-x-2 text-xl font-bold pt-1">
        <img src={`/images/${icon}.png`} alt="" />
        <h1>{title}</h1>
      </div>
      {children}
    </div>
  );
};

export default Card;
