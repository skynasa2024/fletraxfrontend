import Toolbar from './Toolbar';
import { Model, ModelSeries, ModelYear, FuelType, Gear, Volume, Power, Color, Tayp } from './svg';

const VehicleInfoCards = () => {
  const vehicleInfo = [
    { label: 'Model', value: 'Corolla', Icon: Model },
    { label: 'Model Series', value: 'SEDAN', Icon: ModelSeries },
    { label: 'Model Year', value: '2021', Icon: ModelYear },
    { label: 'Fuel Type', value: 'Benzin', Icon: FuelType },
    { label: 'Gear', value: 'Automatic', Icon: Gear },
    { label: 'Volume', value: '200', Icon: Volume },
    { label: 'Power', value: '200', Icon: Power },
    { label: 'Color', value: 'White', Icon: Color },
    { label: 'Tayp', value: 'Easy', Icon: Tayp }
  ];

  return (
    <>
      <Toolbar />
      <div className="w-full max-w-4xl mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {vehicleInfo.map(({ label, value, Icon }, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 transition-shadow hover:shadow-md"
            >
              <div className="flex flex-col items-start space-y-2">
                <div className="flex items-center space-x-2">
                  <Icon className="w-5 h-5 text-gray-400" />
                  <span className="text-sm text-gray-500 font-medium">{label}</span>
                </div>
                <span className="text-lg font-semibold text-gray-900">{value}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4"> {/* left part */}</div>
      </div>
    </>
  );
};

export default VehicleInfoCards;
