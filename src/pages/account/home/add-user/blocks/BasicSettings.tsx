import { FaCalendarAlt } from 'react-icons/fa';

interface IGeneralSettingsProps {
  title: string;
}

const BasicSettings = ({ title }: IGeneralSettingsProps) => {
  return (
    <div className="card pb-2.5">
      <div className="card-header" id="general_settings">
        <h3 className="card-title">{title}</h3>
      </div>
      <div className="card-body grid gap-5">
        <div className="grid lg:grid-cols-2 gap-5">
          <div className="grid gap-2.5">
            <label className="form-label">Name</label>
            <input type="text" className="input " placeholder="Name" />
          </div>
          <div className="grid gap-2.5">
            <label className="form-label">Identify Number</label>
            <input type="text" className="input " placeholder="Identify Number" />
          </div>
        </div>
        <div className="grid lg:grid-cols-2 gap-5">
          <div className="grid gap-2.5">
            <label className="form-label">Subscription Start Date</label>

            <div className="relative flex items-center">
              
              <input type="text" className="input w-full" placeholder="00 / 00 / 0000" />
              <FaCalendarAlt className="absolute right-3 text-gray-500" />
            </div>
          </div>

          <div className="grid gap-2.5">
            <label className="form-label">Time Zone</label>
            <select className="select">
              <option>UTC</option> <option>GMT</option> <option>CET</option> <option>EST</option>
              <option>PST</option> <option>IST</option> <option>JST</option>
            </select>
          </div>
        </div>

        <div className="grid gap-2.5 w-1/2">
          <label className="form-label">Role</label>
          <select className="select">
            <option>Role</option> <option>Option 2</option> <option>Option 3</option>
          </select>
          <div className="grid gap-2.5"></div>
        </div>
        <div className="grid gap-2.5">
          <label className="form-label">Photo</label>
          <div className="border-dashed border-2 border-gray-300 p-5 text-center">
            <p>Drag and drop your files</p> <p>Unlimited files, 5GB total limit</p>
            <button className="btn btn-primary mt-2">Or choose files</button>
          </div>
        </div>
        <div className="grid gap-2.5">
          <label className="form-label">Status</label>
          <div className="flex items-center">
            <div className="flex items-center gap-2.5">
              <div className="switch switch-sm">
                <input name="param" type="checkbox" defaultValue={1} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { BasicSettings, type IGeneralSettingsProps };
