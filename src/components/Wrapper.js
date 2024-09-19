import React from 'react';

const Wrapper = ({ children }) => {
  return (
    <div className="flex flex-row justify-center p-8 min-h-screen max-sm:p-1">
      <div className="flex flex-row w-[100%] max-sm:flex-col min-h-[90%]">
        {children}
      </div>
    </div>
  );
};

export default Wrapper;
