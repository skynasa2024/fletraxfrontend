import { toAbsoluteUrl } from '@/utils/Assets';

interface CarProps {
  direction?: number;
}

const Car = ({ direction }: CarProps) => {
  return (
    <div className="card flex flex-col justify-center h-full p-14">
      <div
        className="relative w-64 h-64 mx-auto"
        style={{ transform: `rotate(${direction ?? 0}deg)` }}
      >
        {/* Rotating circles background */}
        <div className="absolute inset-0 animate-spin duration-3000 opacity-30">
          {/* Upper Circle (Larger than the borders) */}
          <div className="absolute top-[-10%] left-[-10%] w-[120%] h-[120%] bg-blue-100 rounded-full" />

          {/* Middle Circle */}
          <div className="absolute top-6 left-6 right-6 bottom-6 bg-blue-200 rounded-full" />

          {/* Inner Circle */}
          <div className="absolute top-16 left-16 right-16 bottom-16 bg-blue-300 rounded-full" />
        </div>

        {/* Corners */}
        <div className="absolute top-0 left-10 w-16 h-20 border-t-2 border-l-2 border-blue-500 rounded-tl-full" />
        <div className="absolute top-0 right-10 w-16 h-20 border-t-2 border-r-2 border-blue-500 rounded-tr-full" />
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
