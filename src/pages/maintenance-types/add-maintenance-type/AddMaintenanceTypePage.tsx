import { MaintenanceTypeModel } from '@/api/maintenance-type';

export interface AddMaintenanceTypePageProps {
  type?: MaintenanceTypeModel;
}

const AddMaintenanceTypePage = ({ type }: AddMaintenanceTypePageProps) => {
  return (
    <div className="grid gap-5 lg:gap-7.5 xl:w-[60rem] mx-auto">
      <div className="card">
        <div className="card-header" id="maintenance_settings">
          <h3 className="card-title">Maintenance Type</h3>
        </div>
        <div className="card-body grid lg:grid-cols-2 gap-5">
          <div className="grid gap-2.5">
            <label className="form-label">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              className="input"
              placeholder="title"
              defaultValue={type?.title}
            />
          </div>

          <div className="grid gap-2.5">
            <label className="form-label">Code</label>
            <input
              type="text"
              id="code"
              name="code"
              className="input"
              placeholder="code"
              defaultValue={type?.code}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export { AddMaintenanceTypePage };
