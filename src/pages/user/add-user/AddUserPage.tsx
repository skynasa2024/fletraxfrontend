import React, { useRef, useState } from 'react';
import { Information, Contact, InformationAccount } from './blocks';
import { UserModel } from '@/api/user';
import { CompanyInformation } from './blocks/CompanyInformation';
import { Device } from './blocks/Device';

export interface AddUserPageProps {
  user?: UserModel;
}

const AddUserPage = ({ user }: AddUserPageProps) => {
  const [activeTab, setActiveTab] = useState<
    'information' | 'account' | 'contact' | 'company info' | 'device'
  >('information');

  const informationRef = useRef<HTMLDivElement>(null);
  const accountRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);
  const companyInformationRef = useRef<HTMLDivElement>(null);
  const deviceRef = useRef<HTMLDivElement>(null);

  const handleTabClick = (
    ref: React.RefObject<HTMLDivElement | null>,
    tab: 'information' | 'account' | 'contact' | 'company info' | 'device'
  ) => {
    setActiveTab(tab);

    ref.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    });

    const header = ref.current?.querySelector('h2');
    if (header) {
      header.setAttribute('tabindex', '-1');
      header.focus();
    }
  };

  return (
    <div className="grid gap-5 lg:gap-7.5 xl:w-[60rem] mx-auto">
      <div className="tabs flex " data-tabs="true">
        <button
          type="button"
          className={`tab px-4 py-2 font-medium text-lg border-b-4 ${
            activeTab === 'information'
              ? 'text-primary border-primary'
              : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
          }`}
          onClick={() => handleTabClick(informationRef, 'information')}
        >
          Information
        </button>
        <button
          type="button"
          className={`tab px-4 py-2 font-medium text-lg border-b-4 ${
            activeTab === 'account'
              ? 'text-primary border-primary'
              : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
          }`}
          onClick={() => handleTabClick(accountRef, 'account')}
        >
          Account
        </button>
        <button
          type="button"
          className={`tab px-4 py-2 font-medium text-lg border-b-4 ${
            activeTab === 'contact'
              ? 'text-primary border-primary'
              : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
          }`}
          onClick={() => handleTabClick(contactRef, 'contact')}
        >
          Contact
        </button>
        <button
          type="button"
          className={`tab px-4 py-2 font-medium text-lg border-b-4 ${
            activeTab === 'company info'
              ? 'text-primary border-primary'
              : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
          }`}
          onClick={() => handleTabClick(companyInformationRef, 'company info')}
        >
          Company Information
        </button>
        <button
          type="button"
          className={`tab px-4 py-2 font-medium text-lg border-b-4 ${
            activeTab === 'device'
              ? 'text-primary border-primary'
              : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
          }`}
          onClick={() => handleTabClick(deviceRef, 'device')}
        >
          Device
        </button>
      </div>

      <div ref={informationRef}>
        <Information user={user} />
      </div>
      <div ref={accountRef}>
        <InformationAccount user={user} />
      </div>
      <div ref={contactRef}>
        <Contact user={user} />
      </div>
      <div ref={companyInformationRef}>
        <CompanyInformation user={user} />
      </div>
      <div ref={deviceRef}>
        <Device user={user} />
      </div>
    </div>
  );
};

export { AddUserPage };
