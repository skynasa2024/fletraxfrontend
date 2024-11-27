import { useParams } from 'react-router-dom';

const VehicleDetailsPage = () => {
  const { vehicleId } = useParams();

  // Fetch and display vehicle details based on the ID
  // Example:
  // const [vehicle, setVehicle] = useState<VehicleDetails | null>(null);
  // useEffect(() => {
  //   fetchVehicle(vehicleId).then(setVehicle);
  // }, [vehicleId]);

  return (
    <div>
      <div className="card max-w-4xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
      <div className="card-body p-8">
       

          
          
      </div>
    </div>
    </div>
  );
};

export default VehicleDetailsPage;
