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
            <div
              className="input"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                (e.currentTarget.children[0] as HTMLInputElement).showPicker();
              }}
            >
              <Field
                type="date"
                name="inspectionStartDate"
                className="appearance-none [&::-webkit-calendar-picker-indicator]:hidden"
                placeholder="DD/MM/YYYY"
              />
              <CalendarIcon />
            </div>
          </div>
          <div className="grid gap-2.5">
            <label className="form-label">Inspection End Date</label>
            <div
              className="input"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                (e.currentTarget.children[0] as HTMLInputElement).showPicker();
              }}
            >
              <Field
                type="date"
                name="inspectionEndDate"
                className="appearance-none [&::-webkit-calendar-picker-indicator]:hidden"
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
            <div
              className="input"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                (e.currentTarget.children[0] as HTMLInputElement).showPicker();
              }}
            >
              <Field
                type="date"
                name="insuranceStartDate"
                className="appearance-none [&::-webkit-calendar-picker-indicator]:hidden"
                placeholder="DD/MM/YYYY"
              />
              <CalendarIcon />
            </div>
          </div>
          <div className="grid gap-2.5">
            <label className="form-label">Insurance End Date</label>
            <div
              className="input"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                (e.currentTarget.children[0] as HTMLInputElement).showPicker();
              }}
            >
              <Field
                type="date"
                name="insuranceEndDate"
                className="appearance-none [&::-webkit-calendar-picker-indicator]:hidden"
                placeholder="DD/MM/YYYY"
              />
              <CalendarIcon />
            </div>
          </div>
        </div>

        {/* Kasko Dates */}
        <div className="grid lg:grid-cols-2 gap-5">
          <div className="grid gap-2.5">
            <label className="form-label">Kasko Start Date</label>
            <div
              className="input"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                (e.currentTarget.children[0] as HTMLInputElement).showPicker();
              }}
            >
              <Field
                type="date"
                name="kaskoStartDate"
                className="appearance-none [&::-webkit-calendar-picker-indicator]:hidden"
                placeholder="DD/MM/YYYY"
              />
              <CalendarIcon />
            </div>
          </div>
          <div className="grid gap-2.5">
            <label className="form-label">Kasko End Date</label>
            <div
              className="input"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                (e.currentTarget.children[0] as HTMLInputElement).showPicker();
              }}
            >
              <Field
                type="date"
                name="kaskoEndDate"
                className="appearance-none [&::-webkit-calendar-picker-indicator]:hidden"
                placeholder="DD/MM/YYYY"
              />
              <CalendarIcon />
            </div>
          </div>
        </div>

        {/* Exhaust Dates */}
        <div className="grid lg:grid-cols-2 gap-5">
          <div className="grid gap-2.5">
            <label className="form-label">Exhaust Start Date</label>
            <div
              className="input"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                (e.currentTarget.children[0] as HTMLInputElement).showPicker();
              }}
            >
              <Field
                type="date"
                name="exhaustStartDate"
                className="appearance-none [&::-webkit-calendar-picker-indicator]:hidden"
                placeholder="DD/MM/YYYY"
              />
              <CalendarIcon />
            </div>
          </div>
          <div className="grid gap-2.5">
            <label className="form-label">Exhaust End Date</label>
            <div
              className="input"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                (e.currentTarget.children[0] as HTMLInputElement).showPicker();
              }}
            >
              <Field
                type="date"
                name="exhaustEndDate"
                className="appearance-none [&::-webkit-calendar-picker-indicator]:hidden"
                placeholder="DD/MM/YYYY"
              />
              <CalendarIcon />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { InspectionAndInsurance };
