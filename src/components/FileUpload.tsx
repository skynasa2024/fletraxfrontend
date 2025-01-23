import { toAbsoluteUrl } from '@/utils';
import { ChangeEvent, InputHTMLAttributes, useRef, useState } from 'react';
import { KeenIcon } from './keenicons';

const FileUpload = ({
  isUploaded,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { isUploaded?: boolean }) => {
  const [file, setFile] = useState<File | null>(isUploaded ? new File([], '__doc__') : null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <div
      className="border-dashed border-2 border-gray-300 rounded-lg p-6 text-center h-full w-full"
      onDragOver={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragOver(true);
      }}
      onDragLeave={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragOver(false);
      }}
      onDrop={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer.files) {
          setFile(e.dataTransfer.files[0]);
        }
        setDragOver(false);
      }}
    >
      <div className="flex flex-col items-center justify-center">
        {file ? (
          <KeenIcon icon="files" style="solid" className="size-6" />
        ) : (
          <img
            src={toAbsoluteUrl('/media/icons/cloud-upload.svg')}
            alt="Upload"
            className="size-6"
          />
        )}
        {dragOver ? (
          <>
            <p className="text-sm text-gray-500">Drop your files here</p>
            <p className="text-xs text-gray-400">Unlimited files, 5GB total limit</p>
          </>
        ) : file ? (
          <p className="my-3 text-sm text-gray-500">
            {file.name === '__doc__'
              ? 'Document file'
              : `${file.name} (${(file.size / 1024).toFixed(0)} KB)`}
          </p>
        ) : (
          <>
            <p className="mb-1 text-sm text-gray-500">Drag and drop your files</p>
            <p className="text-xs text-gray-400 mb-3">Unlimited files, 5GB total limit</p>
          </>
        )}
        <button
          type="button"
          className="btn btn-primary btn-sm"
          style={{ display: dragOver ? 'none' : 'block' }}
          onClick={() => inputRef.current?.click()}
        >
          {file ? 'Change file' : 'or choose files'}
          <input
            {...props}
            type="file"
            className="hidden"
            onChange={handleFileChange}
            ref={inputRef}
          />
        </button>
      </div>
    </div>
  );
};

export default FileUpload;
