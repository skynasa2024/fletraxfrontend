import React, { useState } from 'react';
import { FaCalendarAlt } from 'react-icons/fa';
import { ImageUploadCard } from './ImageUploadCard';

interface IGeneralSettingsProps {
  title: string;
}
const Information = ({ title }: IGeneralSettingsProps) => {
  const [selectedFuel, setSelectedFuel] = useState<string>('Hybrid');
  const [selectedCarType, setSelectedCarType] = useState<string>('PROMO');
  const [selectedGear, setSelectedGear] = useState<string>('Automatic');

  const radioStyle = (isSelected: boolean) =>
    `flex items-center gap-2 px-4 py-2 border rounded-lg cursor-pointer ${
      isSelected
        ? 'border-indigo-500 bg-indigo-50 text-indigo-600'
        : 'border-gray-300 text-gray-600'
    }`;

  return (
    <div className="card pb-2.5">
      <div className="card-header" id="vehicle_information">
        <h3 className="card-title">{title}</h3>
      </div>
      <div className="card-body grid gap-5">
        {/* Brand and Model Row */}
        <div className="grid lg:grid-cols-3 gap-5">
          <div className="grid gap-2.5">
            <label className="form-label">Brand</label>
            <select className="select">
              <option>Toyota</option>
              <option>Honda</option>
              <option>Ford</option>
              <option>BMW</option>
            </select>
          </div>
          <div className="grid gap-2.5">
            <label className="form-label">Model</label>
            <select className="select">
              <option>Model</option>
            </select>
          </div>
          <div className="grid gap-2.5">
            <label className="form-label">Model Series</label>
            <select className="select">
              <option>Model Series</option>
            </select>
          </div>
        </div>

        {/* Model Year, Volume, Power Row */}
        <div className="grid lg:grid-cols-3 gap-5">
          <div className="grid gap-2.5">
            <label className="form-label">Model Year</label>
            <div className="relative flex items-center">
              <input type="text" className="input w-full" placeholder="2024" />
              <svg
                className="absolute right-2"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clip-path="url(#clip0_370_2448)">
                  <path
                    d="M4.88691 4.75646H5.17304C5.60789 4.75646 5.96037 4.40385 5.96037 3.96912V1.79641V0.983707C5.96037 0.548983 5.60789 0.196411 5.17304 0.196411H4.88691C4.4521 0.196411 4.09961 0.548983 4.09961 0.983707V1.79645V3.96912C4.09961 4.40385 4.4521 4.75646 4.88691 4.75646Z"
                    fill="#5E6278"
                  />
                  <path
                    d="M14.9856 4.73693H15.2718C15.7066 4.73693 16.059 4.38436 16.059 3.94959V1.59018V0.964135C16.059 0.529452 15.7066 0.17688 15.2718 0.17688H14.9856C14.5507 0.17688 14.1982 0.529452 14.1982 0.964135V1.59018V3.94955C14.1983 4.38436 14.5508 4.73693 14.9856 4.73693Z"
                    fill="#5E6278"
                  />
                  <path
                    d="M18.7201 1.79639H16.6994V4.15576C16.6994 4.94281 16.0591 5.37691 15.2722 5.37691H14.9861C14.199 5.37691 13.5587 4.7366 13.5587 3.94955V1.79639H6.60079V3.96906C6.60079 4.75611 5.96052 5.39642 5.17347 5.39642H4.88734C4.10033 5.39642 3.46006 4.75611 3.46006 3.96906V1.79639H1.27996C0.574202 1.79639 0 2.37059 0 3.07639V18.5431C0 19.2489 0.574202 19.8231 1.27996 19.8231H18.7201C19.4258 19.8231 20 19.2489 20 18.5431V3.07639C20.0001 2.37063 19.4258 1.79639 18.7201 1.79639ZM18.7201 18.5431H1.28001L1.27996 6.86304H18.7203L18.721 18.5431C18.7209 18.5431 18.7207 18.5431 18.7201 18.5431Z"
                    fill="#5E6278"
                  />
                  <path
                    d="M10.6611 10.7808H12.9593C13.0504 10.7808 13.1243 10.707 13.1243 10.6159V8.62578C13.1243 8.53468 13.0504 8.46082 12.9593 8.46082H10.6611C10.57 8.46082 10.4961 8.53468 10.4961 8.62578V10.6159C10.4961 10.707 10.57 10.7808 10.6611 10.7808Z"
                    fill="#5E6278"
                  />
                  <path
                    d="M14.4111 10.7808H16.7093C16.8004 10.7808 16.8743 10.707 16.8743 10.6159V8.62578C16.8743 8.53468 16.8004 8.46082 16.7093 8.46082H14.4111C14.32 8.46082 14.2461 8.53468 14.2461 8.62578V10.6159C14.2461 10.707 14.32 10.7808 14.4111 10.7808Z"
                    fill="#5E6278"
                  />
                  <path
                    d="M3.15911 14.0389H5.45732C5.54842 14.0389 5.62228 13.9651 5.62228 13.874V11.8838C5.62228 11.7927 5.54842 11.7189 5.45732 11.7189H3.15911C3.068 11.7189 2.99414 11.7927 2.99414 11.8838V13.874C2.99414 13.9651 3.068 14.0389 3.15911 14.0389Z"
                    fill="#5E6278"
                  />
                  <path
                    d="M6.91008 14.0389H9.20829C9.2994 14.0389 9.37326 13.9651 9.37326 13.874V11.8838C9.37326 11.7927 9.2994 11.7189 9.20829 11.7189H6.91008C6.81898 11.7189 6.74512 11.7927 6.74512 11.8838V13.874C6.74512 13.9651 6.81898 14.0389 6.91008 14.0389Z"
                    fill="#5E6278"
                  />
                  <path
                    d="M10.6611 14.0389H12.9593C13.0504 14.0389 13.1242 13.9651 13.1242 13.874V11.8838C13.1242 11.7927 13.0504 11.7189 12.9593 11.7189H10.6611C10.57 11.7189 10.4961 11.7927 10.4961 11.8838V13.874C10.4961 13.9651 10.57 14.0389 10.6611 14.0389Z"
                    fill="#5E6278"
                  />
                  <path
                    d="M14.4111 14.0389H16.7093C16.8004 14.0389 16.8743 13.9651 16.8743 13.874V11.8838C16.8743 11.7927 16.8004 11.7189 16.7093 11.7189H14.4111C14.32 11.7189 14.2461 11.7927 14.2461 11.8838V13.874C14.2461 13.9651 14.32 14.0389 14.4111 14.0389Z"
                    fill="#5E6278"
                  />
                  <path
                    d="M5.45728 14.9769H3.15911C3.068 14.9769 2.99414 15.0508 2.99414 15.1419V17.132C2.99414 17.2231 3.068 17.297 3.15911 17.297H5.45732C5.54842 17.297 5.62228 17.2231 5.62228 17.132V15.1419C5.62224 15.0508 5.54838 14.9769 5.45728 14.9769Z"
                    fill="#5E6278"
                  />
                  <path
                    d="M9.20829 14.9769H6.91008C6.81898 14.9769 6.74512 15.0508 6.74512 15.1419V17.132C6.74512 17.2231 6.81898 17.297 6.91008 17.297H9.20829C9.2994 17.297 9.37326 17.2231 9.37326 17.132V15.1419C9.37326 15.0508 9.2994 14.9769 9.20829 14.9769Z"
                    fill="#5E6278"
                  />
                  <path
                    d="M12.9593 14.9769H10.6611C10.57 14.9769 10.4961 15.0508 10.4961 15.1419V17.132C10.4961 17.2231 10.57 17.297 10.6611 17.297H12.9593C13.0504 17.297 13.1243 17.2231 13.1243 17.132V15.1419C13.1243 15.0508 13.0504 14.9769 12.9593 14.9769Z"
                    fill="#5E6278"
                  />
                  <path
                    d="M16.7093 14.9769H14.4111C14.32 14.9769 14.2461 15.0508 14.2461 15.1419V17.132C14.2461 17.2231 14.32 17.297 14.4111 17.297H16.7093C16.8004 17.297 16.8743 17.2231 16.8743 17.132V15.1419C16.8743 15.0508 16.8004 14.9769 16.7093 14.9769Z"
                    fill="#5E6278"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_370_2448">
                    <rect width="20" height="20" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </div>
          </div>
          <div className="grid gap-2.5">
            <label className="form-label">Volume</label>
            <input type="text" className="input" placeholder="Volume" />
          </div>
          <div className="grid gap-2.5">
            <label className="form-label">Power</label>
            <input type="text" className="input" placeholder="Power" />
          </div>
        </div>

        {/* Fuel Type */}
        <div className="grid gap-2.5">
          <label className="form-label">Fuel Type</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-4 w-full">
            {['Hybrid', 'Diesel', 'Benzin', 'LPG', 'Kerosine', 'Electric'].map((fuel) => (
              <button
              key={fuel}
              onClick={() => setSelectedFuel(fuel)}
              className={`
                px-6 py-2 border border-dashed rounded-md
                ${selectedFuel === fuel 
                  ? 'border-blue-500' 
                  : 'border-gray-300'}
                hover:bg-gray-100 bg-gray-50 transition-colors
                flex items-center gap-2
              `}
            >
              <div 
                className={`
                  w-4 h-4 rounded-full bg-gray-200
                  ${selectedFuel === fuel 
                    ? 'border-4 border-blue-500' 
                    : 'border-2 border-gray-300'
                  }
                `}
              />
              {fuel}
            </button>
            ))}
          </div>
        </div>

        {/* Car Type */}
        <div className="grid gap-2.5">
          <label className="form-label">Car Type</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-4 w-full">
            {['PROMO', 'Pickup', 'COMFORT', 'SUV', 'Bus', 'Van'].map((type) => (
              <button
              key={type}
              onClick={() => setSelectedFuel(type)}
              className={`
                px-6 py-2 border border-dashed rounded-md
                ${selectedFuel === type 
                  ? 'border-blue-500' 
                  : 'border-gray-300'}
                  hover:bg-gray-100 bg-gray-50 transition-colors
                flex items-center gap-2
              `}
            >
              <div 
                className={`
                  w-4 h-4 rounded-full bg-gray-200
                  ${selectedFuel === type 
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

        {/* Gear */}
        {/* Gear, Color, and Number of Seats Row */}
        <div className="grid lg:grid-cols-3 gap-5">
          {/* Gear */}
          <div className="grid gap-2.5">
            <label className="form-label">Gear</label>
            <div className="grid  md:grid-cols-2 gap-4 w-full">
              {['Automatic', 'Manual'].map((gear) => (
                <button
                key={gear}
                onClick={() => setSelectedFuel(gear)}
                className={`
                  px-6 py-2 border border-dashed rounded-md
                  ${selectedFuel === gear 
                    ? 'border-blue-500' 
                    : 'border-gray-300'}
                    hover:bg-gray-100 bg-gray-50 transition-colors
                  flex items-center gap-2
                `}
              >
                <div 
                  className={`
                    w-4 h-4 rounded-full bg-gray-200
                    ${selectedFuel === gear 
                      ? 'border-4 border-blue-500' 
                      : 'border-2 border-gray-300'
                    }
                  `}
                />
                {gear}
              </button>
              ))}
            </div>
          </div>

          {/* Color */}
          <div className="grid gap-2.5">
            <label className="form-label">Color</label>
            <select className="select">
              <option value="red">Red</option>
              <option value="blue">Blue</option>
              <option value="black">Black</option>
              <option value="white">White</option>
            </select>
          </div>

          {/* Number of Seats */}
          <div className="grid gap-2.5">
            <label className="form-label">Number of seats</label>
            <select className="select">
              {[2, 3, 4, 5, 6, 7, 8].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </div>
        </div>
        {/* Image Upload Card */}
        <ImageUploadCard />
      </div>
    </div>
  );
};

export { Information, type IGeneralSettingsProps };
