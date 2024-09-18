// Sidebar.js
import React from 'react';
import { Link } from 'react-router-dom';

// Sidebar component for navigation
const Sidebar = ({ navigation, activeTab, onTabClick, sentRequestsCount, receivedRequestsCount }) => {
  return (
    <div className="w-[20%] h-screen flex flex-col justify-between border-e bg-white">
      <div className="px-4 py-6">
        <ul className="mt-6 space-y-1">
          {navigation.map((item, index) => (
            <li key={index}>
              {item.options ? (
                <details className="group [&_summary::-webkit-details-marker]:hidden">
                  <summary className="flex cursor-pointer items-center justify-between rounded-lg px-4 py-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700">
                    <span className="text-sm font-medium ">
                      {item.name}
                      {(sentRequestsCount + receivedRequestsCount > 0) && (item.name === 'Connection Requests') && (
                        <span className=" ml-2 bg-yellow-400 border-2 border-red-100  rounded-full px-[.3rem] text-[.5rem]"></span>
                      )}
                    </span>
                    <span className="shrink-0 transition duration-300 group-open:-rotate-180">
                      <svg xmlns="http://www.w3.org/2000/svg" className="size-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </span>
                  </summary>
                  <ul className="mt-2 space-y-1 px-4">
                    {item.options.map((subItem, subIndex) => (
                      <li key={subIndex} className="flex flex-row items-center">
                        <button
                          onClick={() => onTabClick(subItem.name)}
                          className={`block w-full text-left rounded-lg px-4 py-2 text-sm font-medium ${activeTab === subItem.name ? 'bg-gray-100 text-gray-700' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                            }`}
                        >
                          {subItem.name}
                          {subItem.name === 'Sent' && sentRequestsCount > 0 && (
                            <span className="ml-2 bg-gray-500 text-white rounded-full px-[.3rem] py-[.1rem] text-xs">{sentRequestsCount}</span>
                          )}
                          {subItem.name === 'Received' && receivedRequestsCount > 0 && (
                            <span className="ml-2 bg-gray-900 text-white rounded-full px-[.3rem] py-[.1rem] text-xs">{receivedRequestsCount}</span>
                          )}
                        </button>
                      </li>
                    ))}
                  </ul>
                </details>
              ) : (
                <Link
                  to={item.name === 'Messaging' ? item.to : '#'}
                  onClick={() => onTabClick(item.name)}
                  className={` w-full text-left rounded-lg px-4 py-2 text-sm font-medium flex items-center justify-between ${activeTab === item.name ? 'bg-gray-100 text-gray-700' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                    }`}
                >
                  {item.name}
                  <span class="material-icons px-2">{item.tag}</span>
                </Link>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;