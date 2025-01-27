import React from "react";

interface IconProps {
  className?: string; 
}

const Icon1: React.FC<IconProps> = ({ className }) => {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 15 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`w-4 h-4 text-gray-500 ${className}`}
    >
      <g clipPath="url(#clip0)">
        <path
          d="M6.85833 4.68215V2.63579C6.85833 1.51036 5.9374 0.589425 4.81197 0.589425H2.7656C1.64017 0.589425 0.719238 1.51036 0.719238 2.63579V4.68215C0.719238 5.80759 1.64017 6.72852 2.7656 6.72852H4.81197C5.9374 6.72852 6.85833 5.80759 6.85833 4.68215Z"
          fill="#5E6278"
        />
        <path
          d="M6.85833 12.1861V10.1397C6.85833 9.01426 5.9374 8.09333 4.81197 8.09333H2.7656C1.64017 8.09333 0.719238 9.01426 0.719238 10.1397V12.1861C0.719238 13.3115 1.64017 14.2324 2.7656 14.2324H4.81197C5.9374 14.2324 6.85833 13.3115 6.85833 12.1861Z"
          fill="#5E6278"
        />
        <path
          d="M14.3617 4.68215V2.63579C14.3617 1.51036 13.4408 0.589425 12.3154 0.589425H10.269C9.14359 0.589425 8.22266 1.51036 8.22266 2.63579V4.68215C8.22266 5.80759 9.14359 6.72852 10.269 6.72852H12.3154C13.4408 6.72852 14.3617 5.80759 14.3617 4.68215Z"
          fill="#5E6278"
        />
        <path
          d="M14.3617 12.1861V10.1397C14.3617 9.01426 13.4408 8.09333 12.3154 8.09333H10.269C9.14359 8.09333 8.22266 9.01426 8.22266 10.1397V12.1861C8.22266 13.3115 9.14359 14.2324 10.269 14.2324H12.3154C13.4408 14.2324 14.3617 13.3115 14.3617 12.1861Z"
          fill="#5E6278"
        />
      </g>
      <defs>
        <clipPath id="clip0">
          <rect width="15" height="15" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default Icon1;
