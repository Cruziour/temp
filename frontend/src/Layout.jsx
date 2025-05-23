import React from 'react';
import { Outlet } from 'react-router-dom';
import Navigation from './components/shared/Navigation/Navigation';

const Layout = () => {
  return (
    <>
      <Navigation />
      <Outlet />
    </>
  );
};

export default Layout;
