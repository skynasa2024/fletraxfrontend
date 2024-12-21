import { FaCalendarAlt } from 'react-icons/fa';

interface IGeneralSettingsProps {
  title: string;
}

const Information = ({ title }: IGeneralSettingsProps) => {
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
            <div className="relative">
              <input type="text" className="input w-full" placeholder="DD/MM/YYYY" />
              <span className="absolute right-2 top-1/2 transform -translate-y-1/2">
                <svg
                  width="20"
                  height="21"
                  viewBox="0 0 20 21"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4.88691 5.25643H5.17304C5.60789 5.25643 5.96037 4.90382 5.96037 4.46909V2.29638V1.48368C5.96037 1.04895 5.60789 0.696381 5.17304 0.696381H4.88691C4.4521 0.696381 4.09961 1.04895 4.09961 1.48368V2.29642V4.46909C4.09961 4.90382 4.4521 5.25643 4.88691 5.25643Z"
                    fill="#5E6278"
                  />
                  <path
                    d="M14.9856 5.23693H15.2718C15.7066 5.23693 16.059 4.88436 16.059 4.44959V2.09018V1.46413C16.059 1.02945 15.7066 0.67688 15.2718 0.67688H14.9856C14.5507 0.67688 14.1982 1.02945 14.1982 1.46413V2.09018V4.44955C14.1983 4.88436 14.5508 5.23693 14.9856 5.23693Z"
                    fill="#5E6278"
                  />
                  <path
                    d="M18.7201 2.29639H16.6994V4.65576C16.6994 5.44281 16.0591 5.87691 15.2722 5.87691H14.9861C14.199 5.87691 13.5587 5.2366 13.5587 4.44955V2.29639H6.60079V4.46906C6.60079 5.25611 5.96052 5.89642 5.17347 5.89642H4.88734C4.10033 5.89642 3.46006 5.25611 3.46006 4.46906V2.29639H1.27996C0.574202 2.29639 0 2.87059 0 3.57639V19.0431C0 19.7489 0.574202 20.3231 1.27996 20.3231H18.7201C19.4258 20.3231 20 19.7489 20 19.0431V3.57639C20.0001 2.87063 19.4258 2.29639 18.7201 2.29639ZM18.7201 19.0431H1.28001L1.27996 7.36304H18.7203L18.721 19.0431C18.7209 19.0431 18.7207 19.0431 18.7201 19.0431Z"
                    fill="#5E6278"
                  />
                  <path
                    d="M10.6611 11.2809H12.9593C13.0504 11.2809 13.1243 11.207 13.1243 11.1159V9.12581C13.1243 9.03471 13.0504 8.96085 12.9593 8.96085H10.6611C10.57 8.96085 10.4961 9.03471 10.4961 9.12581V11.1159C10.4961 11.207 10.57 11.2809 10.6611 11.2809Z"
                    fill="#5E6278"
                  />
                  <path
                    d="M14.4111 11.2809H16.7093C16.8004 11.2809 16.8743 11.207 16.8743 11.1159V9.12581C16.8743 9.03471 16.8004 8.96085 16.7093 8.96085H14.4111C14.32 8.96085 14.2461 9.03471 14.2461 9.12581V11.1159C14.2461 11.207 14.32 11.2809 14.4111 11.2809Z"
                    fill="#5E6278"
                  />
                  <path
                    d="M3.15911 14.5389H5.45732C5.54842 14.5389 5.62228 14.4651 5.62228 14.374V12.3838C5.62228 12.2927 5.54842 12.2189 5.45732 12.2189H3.15911C3.068 12.2189 2.99414 12.2927 2.99414 12.3838V14.374C2.99414 14.4651 3.068 14.5389 3.15911 14.5389Z"
                    fill="#5E6278"
                  />
                  <path
                    d="M6.91008 14.5389H9.20829C9.2994 14.5389 9.37326 14.4651 9.37326 14.374V12.3838C9.37326 12.2927 9.2994 12.2189 9.20829 12.2189H6.91008C6.81898 12.2189 6.74512 12.2927 6.74512 12.3838V14.374C6.74512 14.4651 6.81898 14.5389 6.91008 14.5389Z"
                    fill="#5E6278"
                  />
                  <path
                    d="M10.6611 14.5389H12.9593C13.0504 14.5389 13.1242 14.4651 13.1242 14.374V12.3838C13.1242 12.2927 13.0504 12.2189 12.9593 12.2189H10.6611C10.57 12.2189 10.4961 12.2927 10.4961 12.3838V14.374C10.4961 14.4651 10.57 14.5389 10.6611 14.5389Z"
                    fill="#5E6278"
                  />
                  <path
                    d="M14.4111 14.5389H16.7093C16.8004 14.5389 16.8743 14.4651 16.8743 14.374V12.3838C16.8743 12.2927 16.8004 12.2189 16.7093 12.2189H14.4111C14.32 12.2189 14.2461 12.2927 14.2461 12.3838V14.374C14.2461 14.4651 14.32 14.5389 14.4111 14.5389Z"
                    fill="#5E6278"
                  />
                  <path
                    d="M5.45728 15.4769H3.15911C3.068 15.4769 2.99414 15.5508 2.99414 15.6419V17.632C2.99414 17.7231 3.068 17.797 3.15911 17.797H5.45732C5.54842 17.797 5.62228 17.7231 5.62228 17.632V15.6419C5.62224 15.5508 5.54838 15.4769 5.45728 15.4769Z"
                    fill="#5E6278"
                  />
                  <path
                    d="M9.20829 15.4769H6.91008C6.81898 15.4769 6.74512 15.5508 6.74512 15.6419V17.632C6.74512 17.7231 6.81898 17.797 6.91008 17.797H9.20829C9.2994 17.797 9.37326 17.7231 9.37326 17.632V15.6419C9.37326 15.5508 9.2994 15.4769 9.20829 15.4769Z"
                    fill="#5E6278"
                  />
                  <path
                    d="M12.9593 15.4769H10.6611C10.57 15.4769 10.4961 15.5508 10.4961 15.6419V17.632C10.4961 17.7231 10.57 17.797 10.6611 17.797H12.9593C13.0504 17.797 13.1243 17.7231 13.1243 17.632V15.6419C13.1243 15.5508 13.0504 15.4769 12.9593 15.4769Z"
                    fill="#5E6278"
                  />
                  <path
                    d="M16.7093 15.4769H14.4111C14.32 15.4769 14.2461 15.5508 14.2461 15.6419V17.632C14.2461 17.7231 14.32 17.797 14.4111 17.797H16.7093C16.8004 17.797 16.8743 17.7231 16.8743 17.632V15.6419C16.8743 15.5508 16.8004 15.4769 16.7093 15.4769Z"
                    fill="#5E6278"
                  />
                </svg>
              </span>
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
          <div className="flex flex-col items-center justify-center">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M19.35 10.04C18.67 6.59 15.64 4 12 4C9.11 4 6.6 5.64 5.35 8.04C2.34 8.36 0 10.91 0 14C0 17.31 2.69 20 6 20H19C21.76 20 24 17.76 24 15C24 12.36 21.95 10.22 19.35 10.04ZM14 13V17H10V13H7L12 8L17 13H14Z"
                    fill="#0F0F0F"
                  />
                </svg>

                <p className="mb-1 text-sm text-gray-500">Drag and drop your files</p>
                <p className="text-xs text-gray-400 mb-3">Unlimited files, 5GB total limit</p>
                <button className="btn btn-primary btn-sm">Or choose files</button>
              </div>
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

export { Information, type IGeneralSettingsProps };
