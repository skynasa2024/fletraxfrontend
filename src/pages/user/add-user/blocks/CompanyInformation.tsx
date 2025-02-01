import FileUpload from '@/components/FileUpload';
import { AddUserPageProps } from '../AddUserPage';

const CompanyInformation = ({ user }: AddUserPageProps) => {
  return (
    <div className="card pb-2.5">
      <div className="card-header" id="general_settings">
        <h3 className="card-title">Company Information</h3>
      </div>
      <div className="card-body grid gap-5">
        <div className="grid lg:grid-cols-3 gap-5">
          <div className="flex flex-col gap-2.5">
            <label className="form-label">Tax number</label>
            <input
              required
              type="text"
              className="input"
              name="companyTaxNumber"
              placeholder="Tax Number"
              defaultValue={user?.companyTaxNumber ?? ''}
            />
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-5">
          <div className="flex flex-col gap-2.5">
            <label className="form-label">Contract PDF</label>
            <FileUpload name="contractPdfFile" isUploaded={!!user?.contractPdfFile} />
          </div>
          <div className="grid gap-2.5">
            <label className="form-label">Tax Plate</label>
            <FileUpload name="taxPlateFile" isUploaded={!!user?.taxPlateFile} />
          </div>
        </div>
      </div>
    </div>
  );
};

export { CompanyInformation };
