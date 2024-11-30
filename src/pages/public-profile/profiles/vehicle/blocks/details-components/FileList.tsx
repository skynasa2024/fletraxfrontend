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
  const getIconSrc = (type: string) => `/api/placeholder/24/24`;  // Placeholder for demo

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-4 last:mb-0">
      <div className="flex items-center">
        <img 
          src={getIconSrc(file.type)} 
          alt={`${file.type.toUpperCase()} Icon`} 
          className="w-6 h-6 mr-2" 
        />
        <div>
          <p className="text-sm font-semibold">{file.name}</p>
          <p className="text-xs text-gray-500">{file.size} • {file.version}</p>
        </div>
        <button 
          onClick={onView}
          className="ml-auto bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors"
        >
          View
        </button>
      </div>
    </div>
  );
};

const FileList: React.FC<FileListProps> = ({ files, onView }) => {
  return (
    <div className="flex space-x-4 p-4 ">
      <div className="w-full ">
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