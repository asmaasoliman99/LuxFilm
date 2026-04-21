import { Outlet } from 'react-router';
import React from 'react';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';

export const MainLayouts = () => {
  return (
    <>
      <Navbar />      
      <main>
        <Outlet />    
      </main> 
      <Footer />

    </>
  );
};
