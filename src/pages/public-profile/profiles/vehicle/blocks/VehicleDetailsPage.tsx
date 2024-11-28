import React from 'react';
import Toolbar from './ToolBar';
import Modal from './svg/Model'

const VehicleDetailsPage = () => {
  return (
    <div className="p-4 space-y-4">

      <Toolbar />

      
      <div className="border-2 border-gray-300 rounded-md shadow-sm p-4">
        <p className="text-gray-500 text-center"> Add content here.</p>
        <Modal />
      </div>
    </div>
  );
};

export default VehicleDetailsPage;
