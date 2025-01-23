import { toAbsoluteUrl } from '@/utils';
import { Check } from 'lucide-react';
import React, { useMemo } from 'react';

export interface FileInfo {
  name: string;
  url?: string;
}

interface FileCardProps {
  file: FileInfo;
  onView?: () => void;
}

interface FileListProps {
  files: FileInfo[];
}

const FileCard: React.FC<FileCardProps> = ({ file }) => {
  const type = useMemo(() => {
    if (file.url) {
      const ext = file.url.split('.').pop();
      if (ext) {
        return ext.toUpperCase();
      }
    }
    return 'FILE';
  }, [file.url]);
  const getIconSrc = (type: string) =>
    toAbsoluteUrl(`/media/icons/${type !== 'FILE' ? type.toLowerCase() + '-' : ''}file-icon.svg`); // Placeholder for demo

  return (
    <div className="card hover:shadow-md p-4  mb-4 last:mb-0 w-full">
      <div className="flex items-center sm:flex-row flex-col">
        <img src={getIconSrc(type)} alt={`${type} Icon`} className="size-6 mr-2" />
        <div>
          <p className="text-sm font-semibold">{file.name}</p>
        </div>

        {/* Aligning elements to the end */}
        <div className="ml-auto flex items-center gap-2">
          <a href={file.url} target="_blank" rel="noreferrer">
            <button
              disabled={!file.url}
              className="btn text-blue-500 px-3 py-1 rounded border border-blue-500 hover:bg-blue-500 hover:text-white transition-colors"
            >
              {file.url ? 'View' : 'No File'}
            </button>
          </a>
          <div className="flex items-center justify-center w-5 h-5 bg-green-500 rounded-full">
            <Check className="w-4 h-4 text-white" />
          </div>
        </div>
      </div>
    </div>
  );
};

const FileList: React.FC<FileListProps> = ({ files }) => {
  return (
    <div className="flex space-x-4">
      <div className="w-full">
        {files.map((file, index) => (
          <FileCard key={`${file.name}-${index}`} file={file} />
        ))}
      </div>
    </div>
  );
};

export default FileList;
