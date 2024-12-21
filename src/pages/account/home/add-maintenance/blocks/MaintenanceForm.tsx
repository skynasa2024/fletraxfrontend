import React, { useState } from 'react';

interface MaintenanceFormProps {
  onSubmit: (formData: any) => void;
}

const MaintenanceForm: React.FC<MaintenanceFormProps> = ({ onSubmit }) => {
  const [selectedType, setSelectedType] = useState('ongoing');
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries());
    onSubmit(data);
  };

  return (
    <div className="card pb-2.5">
      <div className="card-header" id="maintenance_settings">
        <h3 className="card-title">Information</h3>
      </div>
      <form onSubmit={handleSubmit} className="card-body grid gap-5">
        <div className="grid lg:grid-cols-2 gap-5">
          <div className="grid gap-2.5">
            <label className="form-label">Types Of Maintenance</label>
            <select className="select" defaultValue="">
              <option value="" disabled>
                Select maintenance type
              </option>
              <option value="oil_change">Oil Change</option>
              <option value="brake_service">Brake Service</option>
              <option value="tire_rotation">Tire Rotation</option>
              <option value="battery">Battery Replacement</option>
              <option value="air_filter">Air Filter Replacement</option>
              <option value="transmission">Transmission Service</option>
              <option value="tune_up">Engine Tune-up</option>
              <option value="alignment">Wheel Alignment</option>
            </select>
          </div>
        </div>
        <div className="grid lg:grid-cols-2 gap-5">
          <div className="grid gap-2.5">
            <label className="form-label">Maintenance Related To Reservation</label>
            <div className="flex items-center">
              <div className="switch switch-sm">
                <input type="checkbox" id="relatedToReservation" name="relatedToReservation" />
              </div>
            </div>
          </div>

          <div className="grid gap-2.5">
            <label className="form-label">Car Or Appointment</label>
            <input
              type="text"
              id="carOrAppointment"
              name="carOrAppointment"
              className="input"
              placeholder="GL96ABR"
            />
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-5">
          <div className="grid gap-2.5">
            <label className="form-label">Supplier</label>
            <input
              type="text"
              id="supplier"
              name="supplier"
              className="input"
              placeholder="Supplier"
            />
          </div>
          <div className="grid gap-2.5">
            <label className="form-label">Price</label>
            <input type="number" id="price" name="price" className="input" placeholder="1 $" />
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-5">
          <div className="grid gap-2.5">
            <label className="form-label">Start Date</label>
            <div className="relative flex items-center">
              <input
                type="input"
                id="startDate"
                name="startDate"
                placeholder="DD/MM/YYYY"
                className="input w-full"
              />
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="absolute right-3 text-gray-500 pointer-events-none"
              >
                <g clipPath="url(#clip0_476_4468)">
                  <path
                    d="M4.88739 4.75634H5.17353C5.60837 4.75634 5.96086 4.40372 5.96086 3.969V1.79629V0.983585C5.96086 0.548861 5.60837 0.196289 5.17353 0.196289H4.88739C4.45259 0.196289 4.1001 0.548861 4.1001 0.983585V1.79633V3.969C4.1001 4.40372 4.45259 4.75634 4.88739 4.75634Z"
                    fill="currentColor"
                  />
                  <path
                    d="M14.9861 4.73681H15.2722C15.707 4.73681 16.0595 4.38423 16.0595 3.94947V1.59005V0.964013C16.0595 0.52933 15.707 0.176758 15.2722 0.176758H14.9861C14.5512 0.176758 14.1987 0.52933 14.1987 0.964013V1.59005V3.94943C14.1988 4.38423 14.5513 4.73681 14.9861 4.73681Z"
                    fill="currentColor"
                  />
                  <path
                    d="M18.7201 1.7959H16.6994V4.15527C16.6994 4.94232 16.0591 5.37643 15.2722 5.37643H14.9861C14.199 5.37643 13.5587 4.73611 13.5587 3.94906V1.7959H6.60079V3.96857C6.60079 4.75562 5.96052 5.39593 5.17347 5.39593H4.88734C4.10033 5.39593 3.46006 4.75562 3.46006 3.96857V1.7959H1.27996C0.574202 1.7959 0 2.3701 0 3.0759V18.5426C0 19.2484 0.574202 19.8226 1.27996 19.8226H18.7201C19.4258 19.8226 20 19.2484 20 18.5426V3.0759C20.0001 2.37014 19.4258 1.7959 18.7201 1.7959ZM18.7201 18.5426H1.28001L1.27996 6.86256H18.7203L18.721 18.5426C18.7209 18.5426 18.7207 18.5426 18.7201 18.5426Z"
                    fill="currentColor"
                  />
                  <path
                    d="M10.6606 10.781H12.9588C13.0499 10.781 13.1238 10.7071 13.1238 10.616V8.6259C13.1238 8.5348 13.0499 8.46094 12.9588 8.46094H10.6606C10.5695 8.46094 10.4956 8.5348 10.4956 8.6259V10.616C10.4956 10.7071 10.5695 10.781 10.6606 10.781Z"
                    fill="currentColor"
                  />
                  <path
                    d="M14.4115 10.781H16.7098C16.8009 10.781 16.8748 10.7071 16.8748 10.616V8.6259C16.8748 8.5348 16.8009 8.46094 16.7098 8.46094H14.4115C14.3204 8.46094 14.2466 8.5348 14.2466 8.6259V10.616C14.2466 10.7071 14.3204 10.781 14.4115 10.781Z"
                    fill="currentColor"
                  />
                  <path
                    d="M3.15959 14.0388H5.45781C5.54891 14.0388 5.62277 13.965 5.62277 13.8739V11.8837C5.62277 11.7926 5.54891 11.7188 5.45781 11.7188H3.15959C3.06849 11.7188 2.99463 11.7926 2.99463 11.8837V13.8739C2.99463 13.965 3.06849 14.0388 3.15959 14.0388Z"
                    fill="currentColor"
                  />
                  <path
                    d="M6.91008 14.0388H9.20829C9.2994 14.0388 9.37326 13.965 9.37326 13.8739V11.8837C9.37326 11.7926 9.2994 11.7188 9.20829 11.7188H6.91008C6.81898 11.7188 6.74512 11.7926 6.74512 11.8837V13.8739C6.74512 13.965 6.81898 14.0388 6.91008 14.0388Z"
                    fill="currentColor"
                  />
                  <path
                    d="M10.6611 14.0388H12.9593C13.0504 14.0388 13.1242 13.965 13.1242 13.8739V11.8837C13.1242 11.7926 13.0504 11.7188 12.9593 11.7188H10.6611C10.57 11.7188 10.4961 11.7926 10.4961 11.8837V13.8739C10.4961 13.965 10.57 14.0388 10.6611 14.0388Z"
                    fill="currentColor"
                  />
                  <path
                    d="M14.4115 14.0388H16.7098C16.8009 14.0388 16.8748 13.965 16.8748 13.8739V11.8837C16.8748 11.7926 16.8009 11.7188 16.7098 11.7188H14.4115C14.3204 11.7188 14.2466 11.7926 14.2466 11.8837V13.8739C14.2466 13.965 14.3204 14.0388 14.4115 14.0388Z"
                    fill="currentColor"
                  />
                  <path
                    d="M5.45776 14.9766H3.15959C3.06849 14.9766 2.99463 15.0504 2.99463 15.1415V17.1317C2.99463 17.2228 3.06849 17.2966 3.15959 17.2966H5.45781C5.54891 17.2966 5.62277 17.2228 5.62277 17.1317V15.1415C5.62273 15.0504 5.54887 14.9766 5.45776 14.9766Z"
                    fill="currentColor"
                  />
                  <path
                    d="M9.20829 14.9766H6.91008C6.81898 14.9766 6.74512 15.0504 6.74512 15.1415V17.1317C6.74512 17.2228 6.81898 17.2966 6.91008 17.2966H9.20829C9.2994 17.2966 9.37326 17.2228 9.37326 17.1317V15.1415C9.37326 15.0504 9.2994 14.9766 9.20829 14.9766Z"
                    fill="currentColor"
                  />
                  <path
                    d="M12.9593 14.9766H10.6611C10.57 14.9766 10.4961 15.0504 10.4961 15.1415V17.1317C10.4961 17.2228 10.57 17.2966 10.6611 17.2966H12.9593C13.0504 17.2966 13.1243 17.2228 13.1243 17.1317V15.1415C13.1243 15.0504 13.0504 14.9766 12.9593 14.9766Z"
                    fill="currentColor"
                  />
                  <path
                    d="M16.7098 14.9766H14.4115C14.3204 14.9766 14.2466 15.0504 14.2466 15.1415V17.1317C14.2466 17.2228 14.3204 17.2966 14.4115 17.2966H16.7098C16.8009 17.2966 16.8748 17.2228 16.8748 17.1317V15.1415C16.8748 15.0504 16.8009 14.9766 16.7098 14.9766Z"
                    fill="currentColor"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_476_4468">
                    <rect width="20" height="20" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </div>
          </div>
          <div className="grid gap-2.5">
            <label className="form-label">Start Time</label>
            <div className="relative flex items-center">
              <input
                type="input"
                id="startTime"
                name="startTime"
                className="select w-full"
                placeholder="07:30 AM"
              />
            </div>
          </div>
        </div>

        <div className="grid gap-2.5">
          <label className="form-label">Description</label>
          <textarea
            id="description"
            name="description"
            className="input p-2"
            placeholder="Description"
            rows={4}
          ></textarea>
        </div>

        <div className="w-full grid grid-cols-6 gap-2.5">
          <label className="form-label col-span-6">Status</label>

          <div
            className={`
           flex items-center gap-2 p-2 rounded-md border border-dashed hover:bg-gray-100 bg-gray-50 transition-colors
          ${selectedType === 'ongoing' ? 'border-blue-500' : 'border-gray-300'}
        `}
          >
            <input
              type="radio"
              name="type"
              id="ongoing"
              checked={selectedType === 'ongoing'}
              onChange={() => setSelectedType('ongoing')}
              className="hidden"
            />
            <label htmlFor="ongoing" className="flex items-center gap-2 cursor-pointer w-full">
              <div
                className={`w-4 h-4 rounded-full bg-gray-200 ${
                  selectedType === 'ongoing'
                    ? 'border-4 border-blue-500'
                    : 'border-2 border-gray-300'
                }`}
              />
              <span className={selectedType === 'ongoing' ? 'text-blue-500' : ''}>Ongoing</span>
            </label>
          </div>

          {/* Finished Option */}
          <div
            className={`
          flex items-center gap-2 p-2 rounded-md border border-dashed hover:bg-gray-100 bg-gray-50 transition-colors
          ${selectedType === 'finished' ? 'border-blue-500' : 'border-gray-300'}
        `}
          >
            <input
              type="radio"
              name="type"
              id="finished"
              checked={selectedType === 'finished'}
              onChange={() => setSelectedType('finished')}
              className="hidden"
            />
            <label htmlFor="finished" className="flex items-center gap-2 cursor-pointer w-full">
              <div
                className={`w-4 h-4 rounded-full bg-gray-200 ${
                  selectedType === 'finished'
                    ? 'border-4 border-blue-500'
                    : 'border-2 border-gray-300'
                }`}
              />
              <span className={selectedType === 'finished' ? 'text-blue-500' : ''}>Finished</span>
            </label>
          </div>
        </div>

        <div className="flex justify-end mt-5">
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default MaintenanceForm;
