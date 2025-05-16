import { useState } from 'react';
import useStateWithCallBack from './useStateWithCallBack';

const useWebRTC = () => {
  const [clients, setClient] = useStateWithCallBack([
    {
      _id: 1,
      name: 'Rohan',
    },
    {
      _id: 2,
      name: 'Sohan',
    },
  ]);
  return { clients };
};

export default useWebRTC;
