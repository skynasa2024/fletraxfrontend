import React from 'react';

interface MaintenanceFormProps {
  onSubmit: (formData: any) => void;
}

const MaintenanceForm: React.FC<MaintenanceFormProps> = ({ onSubmit }) => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries());
    onSubmit(data);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 bg-white shadow-md rounded-lg grid grid-cols-1 sm:grid-cols-2 gap-4"
    >
      
      <div className="sm:col-span-2">
        
        <label htmlFor="maintenanceType" className="block text-sm font-medium text-gray-700">
          
          Types Of Maintenance
        </label>
        <input
          type="text"
          id="maintenanceType"
          name="maintenanceType"
          className="mt-1 p-2 w-1/2 border border-gray-300 rounded-md"
          placeholder="Oil Change"
        />
      </div>
      <div>
        
        <label htmlFor="relatedToReservation" className="block text-sm font-medium text-gray-700">
          
          Maintenance Related To Reservation
        </label>
        <input
          type="checkbox"
          id="relatedToReservation"
          name="relatedToReservation"
          className="mt-1"
        />
      </div>
      <div>
        
        <label htmlFor="carOrAppointment" className="block text-sm font-medium text-gray-700">
          
          Car Or Appointment
        </label>
        <input
          type="text"
          id="carOrAppointment"
          name="carOrAppointment"
          className="mt-1 p-2 w-full border border-gray-300 rounded-md"
          placeholder="GL96ABR"
        />
      </div>
      <div>
        
        <label htmlFor="supplier" className="block text-sm font-medium text-gray-700">
          
          Supplier
        </label>
        <input
          type="text"
          id="supplier"
          name="supplier"
          className="mt-1 p-2 w-full border border-gray-300 rounded-md"
          placeholder="Supplier"
        />
      </div>
      <div>
        
        <label htmlFor="price" className="block text-sm font-medium text-gray-700">
          
          Price
        </label>
        <input
          type="number"
          id="price"
          name="price"
          className="mt-1 p-2 w-full border border-gray-300 rounded-md"
          placeholder="1 $"
        />
      </div>
      <div>
        
        <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
          
          Start Date
        </label>
        <input
          type="date"
          id="startDate"
          name="startDate"
          className="mt-1 p-2 w-full border border-gray-300 rounded-md"
        />
      </div>
      <div>
        
        <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">
          
          Start Time
        </label>
        <input
          type="time"
          id="startTime"
          name="startTime"
          className="mt-1 p-2 w-full border border-gray-300 rounded-md"
          placeholder="07:30 AM"
        />
      </div>
      <div className="sm:col-span-2">
        
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          
          Description
        </label>
        <textarea
          id="description"
          name="description"
          className="mt-1 p-2 w-full border border-gray-300 rounded-md"
          placeholder="Description"
        ></textarea>
      </div>
      <div className="sm:col-span-2">
        
        <label htmlFor="status" className="block text-sm font-medium text-gray-700">
          
          Status
        </label>
        <div className="mt-1 p-2 w-full rounded-md">
          
          <label className="inline-flex items-center">
            
            <input
              type="radio"
              id="finished"
              name="status"
              value="finished"
              className="form-radio"
            />
            <span className="ml-2">Finished</span>
          </label>
          <label className="inline-flex items-center ml-6">
            
            <input
              type="radio"
              id="ongoing"
              name="status"
              value="ongoing"
              className="form-radio"
            />
            <span className="ml-2">Ongoing</span>
          </label>
        </div>
      </div>
      <button
        type="submit"
        className="sm:col-span-2 mt-4 p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 w-1/6"
      >
        
        Submit
      </button>
    </form>
  );
};

export default MaintenanceForm;
