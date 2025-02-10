import FileUpload from '@/components/FileUpload';
import { AddDriverPageProps } from '../AddDriverPage';

const Documents = ({ driver }: AddDriverPageProps) => {
  return (
    <div className="card pb-2.5">
      <div className="card-header" id="general_settings">
        <h3 className="card-title">Documents</h3>
      </div>
      <div className="card-body grid gap-5">
        <div className="grid lg:grid-cols-3 gap-5">
          <div className="flex flex-col gap-2.5">
            <label className="form-label">License number</label>
            <input
              required
              type="text"
              className="input"
              name="licenseSerialNumber"
              placeholder="License number"
              defaultValue={driver?.licenseNumber}
            />
          </div>
          <div className="flex flex-col gap-2.5">
            <label className="form-label">License Issue Date</label>
            <input
              required
              type="date"
              className="input w-full dark:[color-scheme:dark]"
              name="licenseIssueDate"
              defaultValue={driver?.licenseIssueDate}
            />
          </div>
          <div className="flex flex-col gap-2.5">
            <label className="form-label">License Expiry Date</label>
            <input
              required
              type="date"
              className="input w-full dark:[color-scheme:dark]"
              name="licenseExpiryDate"
              defaultValue={driver?.licenseExpiry}
            />
          </div>
        </div>

        <div className="flex flex-col gap-2.5">
          <label className="form-label">Place of issuance of the license</label>
          <input
            required
            type="text"
            className="input"
            placeholder="Place of issuance of the license"
            name="licensePlace"
            defaultValue={driver?.licensePlace}
          />
        </div>

        <div className="grid lg:grid-cols-2 gap-5">
          <div className="flex flex-col gap-2.5">
            <label className="form-label">Front Photo Of Driving License</label>
            <FileUpload
              name="frontDrivingLicensePhotoFile"
              isUploaded={!!driver?.frontDrivingLicensePhoto}
            />
          </div>
          <div className="grid gap-2.5">
            <label className="form-label">Driving License Background Photo</label>
            <FileUpload
              name="backDriverLicensePhotoFile"
              isUploaded={!!driver?.backDriverLicensePhoto}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export { Documents };
