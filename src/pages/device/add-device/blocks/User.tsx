import { AddDevicePageProps } from '../AddDevicePage';

const User = ({ device }: AddDevicePageProps) => {
  return (
    <div className="card pb-2.5">
      <div className="card-header" id="company_settings">
        <h3 className="card-title">User</h3>
      </div>
      <div className="card-body grid grid-cols-3 gap-5">
        <div className="grid gap-2.5">
          <label className="form-label">Company</label>
          <select className="input">
            <option>Company</option>
          </select>
        </div>
        <div className="grid gap-2.5">
          <label className="form-label">Branch</label>
          <input type="text" className="input" placeholder="Branch" value="" readOnly />
        </div>
        <div className="grid gap-2.5 mb-2.5">
          <label className="form-label">Office</label>
          <input type="text" className="input" placeholder="Office" value="" readOnly />
        </div>
      </div>
    </div>
  );
};

export { User };
