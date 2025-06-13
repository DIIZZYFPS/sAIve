import React from 'react';
import { PuffLoader } from 'react-spinners';

const AppLoader: React.FC = () => {
  return (
  <div className='flex items-center justify-center h-screen'>
    <PuffLoader
      color="#eb3737"
      size={60}
      />
      </div>
  );
};

export default AppLoader;