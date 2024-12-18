import { toAbsoluteUrl } from '@/utils/Assets';
import React from 'react';

const Car = () => {
  return (
    <div className="card flex flex-col justify-center h-full p-8 ">
      <div className="relative w-64 h-64 mx-auto rotate-[-30deg]">
        {/* Rotating circles background */}
        <div className="absolute inset-0 animate-spin duration-3000 opacity-30">
          <div className="absolute top-0 left-0 w-full h-full  bg-blue-200 rounded-full" />
          <div className="absolute top-4 left-4 right-4 bottom-4  bg-blue-300 rounded-full" />
          <div className="absolute top-8 left-8 right-8 bottom-8  bg-blue-400 rounded-full" />
        </div>
        <div className="absolute top-0 left-10 w-16 h-20 border-t-2 border-l-2 border-blue-500 rounded-tl-full " />
        <div className="absolute top-0 right-10 w-16 h-20 border-t-2 border-r-2 border-blue-500 rounded-tr-full " />
        <div className="absolute bottom-0 left-10 w-16 h-20 border-b-2 border-l-2 border-blue-500 rounded-bl-full shadow-xl" />
        <div className="absolute bottom-0 right-10 w-16 h-20 border-b-2 border-r-2 border-blue-500 rounded-br-full shadow-xl" />
        {/* Car shape */}
        <div className=" absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-2">
          <img
            src={toAbsoluteUrl('/media/images/car.png')}
            alt="Car top view"
            className="w-full h-auto "
          />
        </div>
      </div>
    </div>
  );
};

export default Car;
