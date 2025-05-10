import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/shared/Card/Card';
import Button from '../../components/shared/Button/Button';

const Home = () => {
  const navigate = useNavigate()
  const startRegister = () => {
    navigate('/authenticate');
  }
  return (
    <div className="container flex justify-center mt-20">
      <Card icon={'logo'} title={'Welcome to Codershouse!'}>
        <p className="px-16 text-sm text-gray-400 leading-loose mt-6">
          We’re working hard to get Codershouse ready for everyone! While we
          wrap up the finishing youches, we’re adding people gradually to make
          sure nothing breaks :)
        </p>
        <div className="flex justify-center mt-5">
          <Button btnText={`Let's Go`} onClick={startRegister} />
        </div>
      </Card>
    </div>
  );
};

export default Home;
