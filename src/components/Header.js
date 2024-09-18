// src/components/Header.js
import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Disclosure, Menu } from '@headlessui/react';
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline';
import axios from '../axios';
import { AuthContext } from '../context/authContext';
import logo from '../logo/logo-white-transparent.png';

const navigation = [
  { name: 'Home', href: '/home', tag: 'home' },
  { name: 'Connect', href: '/connect', tag: 'people' },
  { name: 'Events', href: '/events', tag: 'event' },
  { name: 'University', href: '/university', tag: 'school' },
  { name: 'Resources', href: '/resources', tag: 'menu_book' },
  { name: 'Collaborations', href: '/collaborations', tag: 'work' },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState(location.pathname);

  const handleLogout = async () => {
    try {
      await axios.post('api/users/logout');
      localStorage.removeItem('userInfo');
      localStorage.removeItem('token');
      setUser(null);
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleTabClick = (href) => {
    setActiveTab(href);
  };

  const [profile, setProfile] = useState({});
  const { user } = useContext(AuthContext);
  // console.log(profile);
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return 'Token not found';
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };
        const { data } = await axios.get('api/users/profile', config);
        // console.log('Fetched profile data:', data); // Log fetched data
        setProfile(data);
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };

    fetchProfile();
  }, [user]);

  return (
    <Disclosure as="nav" className="bg-[#350c35ef] fixed w-[100vw] shadow-lg z-10 top-0">
      <div className="mx-auto max-w-7xl px-2 md:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div className="absolute inset-y-0 left-0 flex items-center md:hidden">
            <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
              <span className="sr-only">Open main menu</span>
              <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
              <XMarkIcon className="hidden h-6 w-6" aria-hidden="true" />
            </Disclosure.Button>
          </div>
          <div className="flex flex-1 items-center justify-center md:items-stretch md:justify-start">
            <a href="/home" className="text-2xl font-bold text-white">
              <img src={logo} alt="AlumNet Rajasthan Logo" className="h-14 min-w-40 py-1" />
            </a>
          </div>
          <div className="hidden md:block md:ml-6">
            <div className="flex space-x-4 mr-6">
              {navigation.map((item) => (
                item.name === 'Home' ?
                  <a
                    key={item.name}
                    href={item.href}
                    onClick={() => handleTabClick(item.href)}
                    className={classNames(
                      activeTab === item.href ? 'bg-blue-900 text-white' : 'text-gray-300 hover:bg-blue-700 hover:text-white',
                      'rounded-md px-3 py-1 text-sm font-medium flex flex-col-reverse items-center m-1'
                    )}
                    aria-current={activeTab === item.href ? 'page' : undefined}
                  >
                    {item.name}
                    <span class="material-icons px-2">{item.tag}</span>
                  </a>
                  :
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => handleTabClick(item.href)}
                    className={classNames(
                      activeTab === item.href ? 'bg-blue-900 text-white' : 'text-gray-300 hover:bg-blue-700 hover:text-white',
                      'rounded-md px-3 py-1 text-sm font-medium flex flex-col-reverse items-center m-1'
                    )}
                    aria-current={activeTab === item.href ? 'page' : undefined}
                  >
                    {item.name}
                    <span class="material-icons px-2">{item.tag}</span>
                  </Link>
              ))}
            </div>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 md:static md:inset-auto md:ml-6 md:pr-0 max-md:hidden">
            <button className="bg-blue-800 p-1 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-800">
              <span className="sr-only">View notifications</span>
              <BellIcon className="h-6 w-6" aria-hidden="true" />
            </button>
            <Menu as="div" className="relative ml-3">
              <Menu.Button className="flex rounded-full bg-blue-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-800">
                <span className="sr-only">Open user menu</span>
                <img
                  className="h-8 w-8 rounded-full"
                  src={user ? user.profileImg : "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?w=740&t=st=1725699415~exp=1725700015~hmac=04feb55fd8848c29e1fd50fe7f67686ef34ea6bf5b89e8a9d2a8ce02688f1173"}
                  alt="User"
                />
              </Menu.Button>
              <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <Menu.Item>
                  {({ active }) => (
                    <Link
                      to="/profile"
                      className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                    >
                      Your Profile
                    </Link>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <Link
                      to="/settings"
                      className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                    >
                      Settings
                    </Link>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <a
                      href="/logout"
                      onClick={handleLogout}
                      className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                    >
                      Logout
                    </a>
                  )}
                </Menu.Item>
              </Menu.Items>
            </Menu>
          </div>
        </div>
      </div>

      <Disclosure.Panel className="md:hidden">
        <div className="space-y-1 px-2 pb-3 pt-2">
          {navigation.map((item) => (
            <Disclosure.Button
              key={item.name}
              as={Link}
              to={item.href}
              onClick={() => handleTabClick(item.href)}
              className={classNames(
                activeTab === item.href ? 'bg-blue-900 text-white' : 'text-gray-300 hover:bg-blue-700 hover:text-white',
                'block rounded-md px-3 py-2 text-base font-medium'
              )}
              aria-current={activeTab === item.href ? 'page' : undefined}
            >
              {item.name}
            </Disclosure.Button>
          ))}
        </div>
      </Disclosure.Panel>
    </Disclosure>
  );
};

export default Header;