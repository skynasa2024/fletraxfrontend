import { KeenIcon } from '@/components';
import { Popover } from '@mui/material';
import React from 'react';

export type Scratch = {
  date: string;
  description: string;
  image: string;
};

type ScratchesPopoverProps = {
  className?: string;
  scratches?: Scratch[];
};

const scratches_mock: Scratch[] = [
  {
    date: '2021-09-01',
    description: 'Scratch on the front bumper',
    image: 'https://placehold.co/500'
  },
  {
    date: '2021-09-02',
    description: 'Scratch on the rear bumper',
    image: 'https://placehold.co/500'
  },
  {
    date: '2021-09-01',
    description: 'Scratch on the front bumper',
    image: 'https://placehold.co/500'
  },
  {
    date: '2021-09-02',
    description: 'Scratch on the rear bumper',
    image: 'https://placehold.co/500'
  },
  {
    date: '2021-09-01',
    description: 'Scratch on the front bumper',
    image: 'https://placehold.co/500'
  },
  {
    date: '2021-09-02',
    description: 'Scratch on the rear bumper',
    image: 'https://placehold.co/500'
  },
  {
    date: '2021-09-01',
    description: 'Scratch on the front bumper',
    image: 'https://placehold.co/500'
  },
  {
    date: '2021-09-02',
    description: 'Scratch on the rear bumper',
    image: 'https://placehold.co/500'
  },
  {
    date: '2021-09-01',
    description:
      'Scratch on the front bumperScratch on the front bumperScratch on the front bumperScratch on the front bumperScratch on the front bumperScratch on the front bumperScratch on the front bumperScratch on the front bumperScratch on the front bumperScratch on the front bumperScratch on the front bumperScratch on the front bumperScratch on the front bumperScratch on the front bumperScratch on the front bumperScratch on the front bumperScratch on the front bumperScratch on the front bumper',
    image: 'https://placehold.co/500'
  },
  {
    date: '2021-09-02',
    description: 'Scratch on the rear bumper',
    image: 'https://placehold.co/500'
  },
  {
    date: '2021-09-01',
    description: 'Scratch on the front bumper',
    image: 'https://placehold.co/500'
  },
  {
    date: '2021-09-02',
    description: 'Scratch on the rear bumper',
    image: 'https://placehold.co/500'
  }
];

export default function ScratchesPopover({ className, scratches }: ScratchesPopoverProps) {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;
  return (
    <>
      <button className={className} aria-describedby={id} onClick={handleClick}>
        {scratches ? scratches.length : '0'}
      </button>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        className="rounded-lg max-h-[350px]"
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
      >
        <div>
          {scratches?.length ? (
            scratches_mock.map((scratch, index) => (
              <div key={index} className="px-3">
                <ScratchDetailCard {...scratch} />
                {index < scratches_mock.length - 1 && <hr className="border-gray-200" />}
              </div>
            ))
          ) : (
            <p className="p-3 text-center text-gray-500">No scratches found</p>
          )}
        </div>
      </Popover>
    </>
  );
}

type ScratchDetailCardProps = {
  date: string;
  description: string;
  image: string;
};

function ScratchDetailCard({ date, description, image }: ScratchDetailCardProps) {
  return (
    <div className="flex gap-4 py-3 justify-start items-start">
      <div className="w-32 h-32 rounded-md overflow-hidden">
        <img src={image} alt="scratch" className="object-cover" />
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex gap-2 items-start justify-start">
          <span className="bg-gray-100 p-2 h-10 w-10 flex items-center justify-center rounded-lg">
            <KeenIcon icon="calendar" className="text-info text-2xl" />
          </span>
          <p className="text-sm">{date}</p>
        </div>
        <p className="text-gray-700 text-md max-w-96">{description}</p>
      </div>
    </div>
  );
}
