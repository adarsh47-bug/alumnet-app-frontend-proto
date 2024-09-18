// src/components/HeaderCopy.js
import React from 'react';
import { Disclosure } from '@headlessui/react';
import { Link } from 'react-router-dom';
import logo from '../logo/logo-white-transparent.png';

const Header = () => {
  return (
    <Disclosure as="nav" className="bg-[#350c35ef] fixed w-[100vw] shadow-lg z-10 top-0">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <Link to="/" className="text-2xl font-bold text-white">
              <img src={logo} alt="AlumNet Rajasthan Logo" className="h-14 w-auto py-1" />
            </Link>
          </div>

          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0 max-md:hidden">
            <Link to="/login" className="bg-white p-2 mx-2 rounded-md text-black hover:text-blue focus:outline-none focus:ring-2">
              Sign In

            </Link>
            <Link to="/register" className="flex rounded-md p-3 mx-2 font-bold bg-black text-sm focus:outline-none focus:ring-2 text-white">
              Register
            </Link>
          </div>
        </div>
      </div>
    </Disclosure>
  );
};

export default Header;