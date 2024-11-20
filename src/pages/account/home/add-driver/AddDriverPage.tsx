import React, { useState } from 'react';
import { Tabs, Tab, Box } from '@mui/material';
import { Information, InformationAccount, Contact, Documents } from './blocks';



const AddDriverPage = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (_event: any, newValue: React.SetStateAction<number>) => {
    setActiveTab(newValue);
  };

  return (
    <div className="grid gap-5 lg:gap-7.5 xl:w-[60rem] mx-auto">
      <Tabs value={activeTab} onChange={handleTabChange}>
        <Tab label="Information" />
        <Tab label="Information Account" />
        <Tab label="Documents" />
        <Tab label="Contact" />
      </Tabs>
      <Box hidden={activeTab !== 0}>
        <Information title="Information" />
      </Box>
      <Box hidden={activeTab !== 1}>
        <InformationAccount />
      </Box>
      <Box hidden={activeTab !== 2}>
        <Documents title="documents" />
      </Box>
      <Box hidden={activeTab !== 3}>
        <Contact />
      </Box>
    </div>
  );
};

export { AddDriverPage };
