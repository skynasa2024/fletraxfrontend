import { AddDriverPageProps } from '../AddDriverPage';

const InformationAccount = ({ driver }: AddDriverPageProps) => {
  return (
    <div className="card pb-2.5">
      <div className="card-header" id="company_settings">
        <h3 className="card-title">Information Account</h3>
      </div>
      <div className="card-body grid gap-5">
        <div className="flex flex-col gap-2.5">
          <label className="form-label">User Name</label>
          <input
            required
            type="text"
            autoComplete="username"
            className="input w-1/2"
            placeholder="User Name"
            name="username"
            defaultValue={driver?.username}
          />
        </div>
        <div className="flex flex-col gap-2.5">
          <label className="form-label">Password</label>
          <input
            required={!driver}
            type="password"
            autoComplete="new-password"
            className="input w-1/2"
            placeholder="Password"
            name="password"
          />
        </div>
        <div className="grid gap-2.5 mb-2.5"></div>
      </div>
    </div>
  );
};

export { InformationAccount };
