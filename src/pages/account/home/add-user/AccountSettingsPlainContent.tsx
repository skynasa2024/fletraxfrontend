import { BasicSettings, Password, Contact } from './blocks';

const AccountSettingsPlainContent = () => {
  return (
    <div className="grid gap-5 lg:gap-7.5 xl:w-[60rem] mx-auto">
      <BasicSettings title="Information" />

      <Password />
      <Contact />

 
    </div>
  );
};

export { AccountSettingsPlainContent };
