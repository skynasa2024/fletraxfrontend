import { KeenIcon } from '@/components';
import { Collapse } from '@mui/material';
import { useState } from 'react';

export const MainCard = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="card w-[380px]">
      <div
        className="card-header border-dashed border-b-2"
        onClick={() => setIsOpen((open) => !open)}
      >
        <div className="card-title uppercase font-bold text-[22px]">
          <h3>Monitoring</h3>
        </div>
        {isOpen ? <KeenIcon icon="up" /> : <KeenIcon icon="down" />}
      </div>

      <Collapse in={isOpen}>
        <div className="card-body flex flex-col gap-4 scrollable grow px-3 py-3 h-[455px]"></div>
      </Collapse>
    </div>
  );
};
