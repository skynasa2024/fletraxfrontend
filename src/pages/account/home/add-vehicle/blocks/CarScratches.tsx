import React, { useState } from 'react';
import carImage from './car.png';
import { toAbsoluteUrl } from '@/utils/Assets';

const CarScratches = () => {
  const [selectedPlace, setSelectedPlace] = useState('8');
  const [places, setPlaces] = useState([
    { id: '2', selectedValue: '2' },
    { id: '8', selectedValue: '8' }
  ]);

  const handleAddPlace = () => {
    if (!places.find((p) => p.id === selectedPlace)) {
      setPlaces([...places, { id: selectedPlace, selectedValue: selectedPlace }]);
    }
  };

  const handlePlaceChange = (placeId: string, newValue: string) => {
    setPlaces((prevPlaces) =>
      prevPlaces.map((place) =>
        place.id === placeId ? { ...place, selectedValue: newValue } : place
      )
    );
  };

  const radioStyle = (isSelected: boolean) =>
    `flex items-center gap-2 px-4 py-2 border rounded-lg cursor-pointer ${
      isSelected
        ? 'border-indigo-500 bg-indigo-50 text-indigo-600'
        : 'border-gray-300 text-gray-600'
    }`;

  return (
    <div className="card pb-2.5">
      <div className="card-header">
        <h4 className="text-base font-medium card-title">Car Scratches</h4>
      </div>
      <div className="card-body grid gap-5 grid-cols-1 md:grid-cols-[1fr,300px]">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Dropdown and Add Button */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Choose a place</label>
            <div className="flex gap-4">
              <select
                value={selectedPlace}
                onChange={(e) => setSelectedPlace(e.target.value)}
                className="select"
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((num) => (
                  <option key={num} value={String(num)}>
                    {num}
                  </option>
                ))}
              </select>
              <button
                onClick={handleAddPlace}
                className="px-6 py-2 text-blue-500 border border-blue-500 rounded-md hover:bg-blue-50"
              >
                Add
              </button>
            </div>
            <p className="mt-2 text-sm text-gray-500">As per side image</p>
          </div>

          {/* Place Sections */}
          {places.map((place) => (
            <div key={place.id} className="space-y-2">
              <div className="w-full max-w-2xl p-4">
                {/* Dynamic Place Label */}
                <h3 className="text-lg font-medium mb-4">Place {place.selectedValue}</h3>

                <div className="space-y-4">
                  <div className="flex gap-4">
                    {/* Place Dropdown */}
                    <div className="w-1/3">
                      <select
                        className="select"
                        value={place.selectedValue}
                        onChange={(e) => handlePlaceChange(place.id, e.target.value)}
                      >
                        {Array.from({ length: 12 }, (_, i) => i + 1).map((num) => (
                          <option key={num} value={String(num)}>
                            {num}
                          </option>
                        ))}
                      </select>
                      <p className="mt-1 text-sm text-gray-500">As per side image</p>
                    </div>

                    {/* Image Upload */}
                    <div className="w-2/3">
                      <div className="flex items-center justify-between w-full p-2 border border-gray-200 rounded-lg bg-white">
                        <span className="text-gray-500">Drag and drop your files</span>
                        <button className="px-4 py-1 bg-blue-600 text-white rounded-lg">
                          Or choose files
                        </button>
                      </div>
                      <p className="mt-1 text-sm text-gray-500">
                        Unlimited files (5GB total limit)
                      </p>
                    </div>
                  </div>

                  {/* Explanation Text Area */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Explanation of Place {place.selectedValue}
                    </label>
                    <textarea
                      className="mt-1 w-full p-3 border border-gray-200 rounded-lg resize-none h-32"
                      placeholder="Organize your thoughts with an outline. Here's the outlining strategy I use. I promise it works like a charm."
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right Column - Image Space */}
        <div className="h-full border border-gray-200 rounded-lg p-8">
          <img src={carImage} alt="car" className="w-full h-full object-cover rounded-lg" />
        <div className="relative flex p-4 justify-center items-center">
          <img src={toAbsoluteUrl('/media/images/car.png')} alt="Car" className="" />
          {/* Corners */}
          <div className="absolute top-[130px] left-10 w-16 h-20 border-t-2 border-l-2 border-blue-500 rounded-tl-full" />
          <div
            className="absolute top-[130px] right-10 w-16 h-20 border-t-2 border-r-2 border-blue-500 rounded-tr-full"
            style={{ boxShadow: '4px 0px 0px 0px rgba(0, 0, 0, 0.1)' }}
          />
          <div className="absolute bottom-[130px] left-10 w-16 h-20 border-b-2 border-l-2 border-blue-500 rounded-bl-full shadow-lg" />
          <div className="absolute bottom-[130px] right-10 w-16 h-20 border-b-2 border-r-2 border-blue-500 rounded-br-full shadow-lg" />
          {/* Buttons */}
          {/* Top */}{' '}
          <button className="absolute top-[70px] left-1/2 -translate-x-1/2 border hover:shadow-md bg-gray-50 text-gray-900 rounded-full w-8 h-8 flex items-center justify-center">
            1
          </button>{' '}
          <button className="absolute top-[110px] left-[0px] border hover:shadow-md bg-gray-50 text-gray-900 rounded-full w-8 h-8 flex items-center justify-center">
            10
          </button>{' '}
          <button className="absolute top-[110px] right-[0px] border hover:shadow-md bg-gray-50 text-gray-900 rounded-full w-8 h-8 flex items-center justify-center">
            2
          </button>{' '}
          {/* Upper Middle */}{' '}
          <button className="absolute top-[290px] left-[-12px] border hover:shadow-md bg-gray-50 text-gray-900 rounded-full w-8 h-8 flex items-center justify-center">
            9
          </button>{' '}
          <button className="absolute top-[300px] left-1/2 -translate-x-1/2 border hover:shadow-md bg-gray-50 text-gray-900 rounded-full w-8 h-8 flex items-center justify-center">
            11
          </button>{' '}
          <button className="absolute top-[290px] right-[-12px] border hover:shadow-md bg-gray-50 text-gray-900 rounded-full w-8 h-8 flex items-center justify-center">
            3
          </button>{' '}
          {/* Lower Middle */}{' '}
          <button className="absolute bottom-1/3 left-[-12px] border hover:shadow-md bg-gray-50 text-gray-900 rounded-full w-8 h-8 flex items-center justify-center">
            8
          </button>{' '}
          <button className="absolute bottom-[280px] left-1/2 -translate-x-1/2 border hover:shadow-md bg-gray-50 text-gray-900 rounded-full w-8 h-8 flex items-center justify-center">
            12
          </button>{' '}
          <button className="absolute bottom-1/3 right-[-12px] border hover:shadow-md bg-gray-50 text-gray-900 rounded-full w-8 h-8 flex items-center justify-center">
            4
          </button>{' '}
          {/* Bottom */}{' '}
          <button className="absolute bottom-[70px] left-1/2 -translate-x-1/2 border hover:shadow-md bg-gray-50 text-gray-900 rounded-full w-8 h-8 flex items-center justify-center">
            6
          </button>{' '}
          <button className="absolute bottom-[110px] left-4 border hover:shadow-md bg-gray-50 text-gray-900 rounded-full w-8 h-8 flex items-center justify-center">
            7
          </button>{' '}
          <button className="absolute bottom-[110px] right-4 border hover:shadow-md bg-gray-50 text-gray-900 rounded-full w-8 h-8 flex items-center justify-center">
            5
          </button>
        </div>
      </div>
    </div>
  );
};

export { CarScratches };
