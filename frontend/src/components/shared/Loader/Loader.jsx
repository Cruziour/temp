import React from 'react';
import Card from '../Card/Card';

const Loader = ({ message }) => {
  return (
    <div className="container flex justify-center mt-35">
      <style>
        {`
          @keyframes spinPause {
            0% { transform: rotate(0deg); }
            80% { transform: rotate(360deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
      <Card>
        <div className="flex justify-center items-center w-full h-full">
          <div>
            <div className="pl-20 pb-4">
              <div
                className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"
                style={{
                  animation: 'spinPause 2s linear infinite',
                }}
              ></div>
            </div>
            <span className="font-bold text-lg">{message}</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Loader;
