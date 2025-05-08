import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Card from '../../components/shared/Card/Card';
import Button from '../../components/shared/Button/Button';

const Home = () => {
  const navigate = useNavigate()
  const startRegister = () => {
    navigate('/register')
  }
  return (
    <div className="container flex justify-center mt-20">
      <Card icon={'logo'} title={'Welcome to Codershouse!'}>
        <p className="px-16 text-sm text-gray-400 leading-loose">
          We’re working hard to get Codershouse ready for everyone! While we
          wrap up the finishing youches, we’re adding people gradually to make
          sure nothing breaks :)
        </p>
        <div className="flex justify-center mt-5">
          <Button btnText={'Get your username'} onClick={startRegister} />
        </div>
        <div className="mt-3 text-sm text-blue-600">
          <span>Have an invite text?</span>
          <Link to="/login" className="font-bold pl-2">
            Sign in
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default Home;
