import FileUpload from '@/components/FileUpload';
import { useState } from 'react';

const Information = () => {
  const [selectedType, setSelectedType] = useState('turkish');
  return (
    <div className="card pb-2.5">
      <div className="card-header" id="general_settings">
        <h3 className="card-title">Information</h3>
      </div>
      <div className="card-body grid gap-5">
        <div className="grid lg:grid-cols-2 gap-5">
          <div className="grid gap-2.5">
            <label className="form-label">Full Name</label>
            <input type="text" className="input" name="fullName" placeholder="Full Name" />
          </div>
          <div className="grid gap-2.5">
            <label className="form-label">Date Of Birth</label>
            <input
              type="date"
              className="input w-full"
              name="dateOfBirth"
              placeholder="DD/MM/YYYY"
            />
          </div>
        </div>

        <div className="grid gap-2.5">
          <label className="form-label">Identity Type</label>
          <div className="grid md:grid-cols-2 gap-4 w-full">
            {['Turkish', 'Foreign'].map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type.toLowerCase())}
                className={`
              px-6 py-2 border border-dashed rounded-md dark:bg-light-active dark:light-active
              ${selectedType === type.toLowerCase() ? 'border-blue-500' : 'border-gray-300'}
              hover:bg-gray-100 bg-gray-50 transition-colors
              flex items-center gap-2
            `}
              >
                <div
                  className={`
                w-4 h-4 rounded-full bg-gray-200
                ${
                  selectedType === type.toLowerCase()
                    ? 'border-4 border-blue-500'
                    : 'border-2 border-gray-300'
                }
              `}
                />
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-5">
          <div className="grid gap-2.5">
            <label className="form-label">Front Photo Of National ID</label>
            <FileUpload name="frontNationalIdPhotoFile" />
          </div>
          <div className="grid gap-2.5">
            <label className="form-label">National ID Background Image</label>
            <FileUpload name="backNationalIdPhotoFile" />
          </div>
        </div>
      </div>
    </div>
  );
};

export { Information };
