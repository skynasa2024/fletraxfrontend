import React, { useState } from 'react';
import { Tabs, Tab, Box } from '@mui/material';
import { BasicSettings, Password, Contact } from './blocks';

const AddUserPage = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (_event: any, newValue: React.SetStateAction<number>) => {
    setActiveTab(newValue);
  };

  return (
    <div className="grid gap-5 lg:gap-7.5 xl:w-[60rem] mx-auto">
      <Tabs value={activeTab} onChange={handleTabChange}>
        <Tab label="Information" />
        <Tab label="Account" />
        <Tab label="Contact" />
      </Tabs>
      <Box hidden={activeTab !== 0}>
        <BasicSettings title="Information" />
      </Box>
      <Box hidden={activeTab !== 1}>
        <Password />
      </Box>
      <Box hidden={activeTab !== 2}>
        <Contact />
      </Box>
    </div>
  );
};

export { AddUserPage };
