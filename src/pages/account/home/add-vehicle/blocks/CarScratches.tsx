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

  function handleDeletePlace(id: string): void {
    throw new Error('Function not implemented.');
  }

  return (
    <div className="card pb-2.5">
      <div className="card-header">
        <h3 className="card-title">Car Scratches</h3>
      </div>
      <div className="card-body grid gap-5 grid-cols-1 md:grid-cols-[1fr,300px]">
        {/* Left Column */}
        <div className="space-y-6 p-4">
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
              <div className="p-4 border rounded-xl border-gray-600 relative">
                {/* Dynamic Place Label */}
                <h3 className="text-lg font-medium mb-4">Place {place.selectedValue}</h3>

                {/* Delete Button */}
                <button
                  className="absolute top-4 right-4 text-red-500 hover:text-red-700"
                  onClick={() => handleDeletePlace(place.id)} 
                >
                  <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle opacity="0.05" cx="15" cy="15" r="15" fill="#FF0000"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M18.8356 11.6575C19.0345 11.6575 19.2 11.8226 19.2 12.0327V12.2269C19.2 12.4318 19.0345 12.602 18.8356 12.602H10.3649C10.1655 12.602 10 12.4318 10 12.2269V12.0327C10 11.8226 10.1655 11.6575 10.3649 11.6575H11.8551C12.1578 11.6575 12.4213 11.4423 12.4894 11.1387L12.5674 10.7902C12.6887 10.3154 13.0879 10 13.5447 10H15.6553C16.1072 10 16.5108 10.3154 16.6276 10.7651L16.7111 11.1382C16.7787 11.4423 17.0422 11.6575 17.3454 11.6575H18.8356ZM18.0785 18.7575C18.2341 17.3075 18.5065 13.8626 18.5065 13.8279C18.5164 13.7226 18.4821 13.6229 18.414 13.5427C18.341 13.4675 18.2485 13.4231 18.1466 13.4231H11.0572C10.9548 13.4231 10.8574 13.4675 10.7898 13.5427C10.7212 13.6229 10.6874 13.7226 10.6924 13.8279C10.6933 13.8342 10.703 13.9556 10.7194 14.1585C10.792 15.0597 10.9942 17.5697 11.1248 18.7575C11.2173 19.6325 11.7914 20.1824 12.623 20.2024C13.2648 20.2172 13.9259 20.2223 14.6019 20.2223C15.2387 20.2223 15.8854 20.2172 16.547 20.2024C17.4074 20.1876 17.9811 19.6473 18.0785 18.7575Z" fill="#FF0000"/>
</svg>

                </button>

                <div className="space-y-4">
                  <div className="flex gap-4">
                    {/* Place Dropdown */}
                    <div className="w-1/3">
                      <select
                        className="select border rounded-lg border-gray-600 h-12"
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
                      <div className="flex items-center justify-between w-full p-2 border border-gray-600 rounded-lg bg-white">
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
                      className="mt-1 w-full p-3 border rounded-xl border-gray-600 resize-none h-32"
                      placeholder="Organize your thoughts with an outline. Here's the outlining strategy I use. I promise it works like a charm."
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right Column - Image Space */}

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
          <button className="absolute top-[70px] left-1/2 -translate-x-1/2 border hover:shadow-md bg-gray-50 rounded-full w-8 h-8 flex items-center justify-center">
            1
          </button>{' '}
          <button className="absolute top-[110px] left-[0px] border hover:shadow-md bg-gray-50 rounded-full w-8 h-8 flex items-center justify-center">
            10
          </button>{' '}
          <button className="absolute top-[110px] right-[0px] border hover:shadow-md bg-gray-50 rounded-full w-8 h-8 flex items-center justify-center">
            2
          </button>{' '}
          {/* Upper Middle */}{' '}
          <button className="absolute top-[290px] left-[-12px] border hover:shadow-md bg-gray-50 rounded-full w-8 h-8 flex items-center justify-center">
            9
          </button>{' '}
          <button className="absolute top-[300px] left-1/2 -translate-x-1/2 border hover:shadow-md bg-gray-50 rounded-full w-8 h-8 flex items-center justify-center">
            11
          </button>{' '}
          <button className="absolute top-[290px] right-[-12px] border hover:shadow-md bg-gray-50 rounded-full w-8 h-8 flex items-center justify-center">
            3
          </button>{' '}
          {/* Lower Middle */}{' '}
          <button className="absolute bottom-1/3 left-[-12px] border hover:shadow-md bg-gray-50 rounded-full w-8 h-8 flex items-center justify-center">
            8
          </button>{' '}
          <button className="absolute bottom-[280px] left-1/2 -translate-x-1/2 border hover:shadow-md bg-gray-50 rounded-full w-8 h-8 flex items-center justify-center">
            12
          </button>{' '}
          <button className="absolute bottom-1/3 right-[-12px] border hover:shadow-md bg-gray-50 rounded-full w-8 h-8 flex items-center justify-center">
            4
          </button>{' '}
          {/* Bottom */}{' '}
          <button className="absolute bottom-[70px] left-1/2 -translate-x-1/2 border hover:shadow-md bg-gray-50 rounded-full w-8 h-8 flex items-center justify-center">
            6
          </button>{' '}
          <button className="absolute bottom-[110px] left-4 border hover:shadow-md bg-gray-50 rounded-full w-8 h-8 flex items-center justify-center">
            7
          </button>{' '}
          <button className="absolute bottom-[110px] right-4 border hover:shadow-md bg-gray-50 rounded-full w-8 h-8 flex items-center justify-center">
            5
          </button>
        </div>
      </div>
    </div>
  );
};

export { CarScratches };
