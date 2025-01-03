import { Check } from 'lucide-react';
import React from 'react';

interface FileInfo {
  name: string;
  size: string;
  version: string;
  type: 'pdf' | 'jpg' | string;
}

interface FileCardProps {
  file: FileInfo;
  onView?: () => void;
}

interface FileListProps {
  files: FileInfo[];
  onView?: (file: FileInfo) => void;
}

const FileCard: React.FC<FileCardProps> = ({ file, onView }) => {
  const getIconSrc = (type: string) => `/api/placeholder/24/24`; // Placeholder for demo

  return (
    <div className="card hover:shadow-md p-4 rounded-lg mb-4 last:mb-0 w-full h-1/2">
      <div className="flex items-center sm:flex-row flex-col">
        <img
          src={getIconSrc(file.type)}
          alt={`${file.type.toUpperCase()} Icon`}
          className="w-6 h-6 mr-2 mb-5"
        />
        <div>
          <p className="text-sm font-semibold">{file.name}</p>
          <p className="text-xs text-gray-500">
            {file.size} • {file.version}
          </p>
        </div>

  
        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={onView}
            className="text-blue-500 px-3 py-1 rounded border border-blue-500 hover:bg-blue-500 hover:text-white transition-colors"
          >
            View
          </button>
          <div className="flex items-center justify-center w-5 h-5 bg-green-500 rounded-full">
            <Check className="w-4 h-4 text-white" />
          </div>
        </div>
      </div>
    </div>
  );
};

const FileList: React.FC<FileListProps> = ({ files, onView }) => {
  return (
    <div className=" flex space-x-4">
      <div className="w-full">
        {files.map((file, index) => (
          <FileCard
            key={`${file.name}-${index}`}
            file={file}
            onView={() => onView?.(file)}
          />
        ))}
      </div>
    </div>
  );
};

export default FileList;
