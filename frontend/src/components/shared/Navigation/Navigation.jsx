import React from 'react';
import { Link } from 'react-router-dom';

const Navigation = () => {
  return (
    <nav className="container min-w-full min-h-[8vh] flex justify-center items-center ">
      <div className="min-w-[90vw]">
        <Link to="/" className="flex items-center gap-x-2">
          <img src="/images/logo.png" alt="" />
          <span className="text-[22px] font-bold">Codershouse</span>
        </Link>
      </div>
    </nav>
  );
};

export default Navigation;
