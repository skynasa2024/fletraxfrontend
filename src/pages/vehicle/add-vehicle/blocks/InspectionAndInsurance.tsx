import { Field } from 'formik';
import CalendarIcon from '../../blocks/svg/CalendarIcon';

const InspectionAndInsurance = () => {
  return (
    <div className="card pb-2.5">
      <div className="card-header" id="company_settings">
        <h3 className="card-title">Inspection and Insurance</h3>
      </div>
      <div className="card-body grid gap-5">
        {/* Inspection Dates */}
        <div className="grid lg:grid-cols-2 gap-5">
          <div className="grid gap-2.5">
            <label className="form-label">Inspection Start Date</label>
            <div className="input">
              <Field type="text" name="inspectionStartDate" placeholder="DD/MM/YYYY" />
              <CalendarIcon />
            </div>
          </div>
          <div className="grid gap-2.5">
            <label className="form-label">Inspection End Date</label>
            <div className="input">
              <Field
                type="text"
                className="input"
                name="inspectionEndDate"
                placeholder="DD/MM/YYYY"
              />
              <CalendarIcon />
            </div>
          </div>
        </div>

        {/* Insurance Dates */}
        <div className="grid lg:grid-cols-2 gap-5">
          <div className="grid gap-2.5">
            <label className="form-label">Insurance Start Date</label>
            <div className="input">
              <Field type="text" name="insuranceStartDate" placeholder="DD/MM/YYYY" />
              <CalendarIcon />
            </div>
          </div>
          <div className="grid gap-2.5">
            <label className="form-label">Insurance End Date</label>
            <div className="input">
              <Field type="text" name="insuranceEndDate" placeholder="DD/MM/YYYY" />
              <CalendarIcon />
            </div>
          </div>
        </div>

        {/* Kasko Dates */}
        <div className="grid lg:grid-cols-2 gap-5">
          <div className="grid gap-2.5">
            <label className="form-label">Kasko Start Date</label>
            <div className="input">
              <Field type="text" name="kaskoStartDate" placeholder="DD/MM/YYYY" />
              <CalendarIcon />
            </div>
          </div>
          <div className="grid gap-2.5">
            <label className="form-label">Kasko End Date</label>
            <div className="input">
              <Field type="text" name="kaskoEndDate" placeholder="DD/MM/YYYY" />
              <CalendarIcon />
            </div>
          </div>
        </div>

        {/* Exhaust Dates */}
        <div className="grid lg:grid-cols-2 gap-5">
          <div className="grid gap-2.5">
            <label className="form-label">Exhaust Start Date</label>
            <div className="input">
              <Field type="text" name="exhaustStartDate" placeholder="DD/MM/YYYY" />
              <CalendarIcon />
            </div>
          </div>
          <div className="grid gap-2.5">
            <label className="form-label">Exhaust End Date</label>
            <div className="input">
              <Field type="text" name="exhaustEndDate" placeholder="DD/MM/YYYY" />
              <CalendarIcon />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { InspectionAndInsurance };
