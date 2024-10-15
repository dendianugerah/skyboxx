import React, { useState, useCallback } from 'react';
import { useDropzone, Accept } from 'react-dropzone';
import { Upload, X, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from './button';
import { Progress } from './progress';
import { cn } from './lib/utils';
import { CloudProvider, useCloudUpload, Config } from './hooks/use-cloud-upload';

interface SkyboxUploadProps {
  cloudProvider: CloudProvider;
  cloudConfig: Config;
  onUploadComplete?: (urls: string[]) => void;
  maxSize?: number;
  multiple?: boolean;
  className?: string;
  acceptedFileTypes?: Accept;
}

export function SkyboxUpload({
  cloudProvider,
  cloudConfig,
  onUploadComplete,
  maxSize = 10 * 1024 * 1024, // 10MB default
  multiple = false,
  className = '',
  acceptedFileTypes,
}: SkyboxUploadProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [progress, setProgress] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const { uploadToCloud, isUploading } = useCloudUpload(cloudProvider, cloudConfig);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFiles(prevFiles => [...prevFiles, ...acceptedFiles]);
      setProgress(prevProgress => [...prevProgress, ...Array(acceptedFiles.length).fill(0)]);
      setError(null);
      setSuccess(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    maxSize,
    accept: acceptedFileTypes,
    multiple
  });

  const handleUpload = async () => {
    if (files.length === 0) return;

    try {
      setError(null);
      setSuccess(false);

      const uploadPromises = files.map(async (file, index) => {
        try {
          const uploadUrl = await uploadToCloud(file, (progress) => {
            setProgress(prev => {
              const newProgress = [...prev];
              newProgress[index] = progress;
              return newProgress;
            });
          });
          return uploadUrl;
        } catch (err) {
          throw err;
        }
      });

      const uploadedUrls = await Promise.all(uploadPromises);

      setSuccess(true);
      onUploadComplete?.(uploadedUrls);
    } catch (err) {
      setError('Upload failed. Please try again.');
    }
  };

  const removeFile = (index: number) => {
    setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
    setProgress(prevProgress => prevProgress.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div
      {...getRootProps()}
      className={cn(
        'p-4 border-2 border-dashed rounded-lg',
        isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300',
        className
      )}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center justify-center space-y-3">
        {files.length === 0 && (
          <>
            <Upload className="w-8 h-8 text-gray-400" />
            <p className="text-sm text-gray-500 text-center">
              {isDragActive ? 'Drop files here' : 'Drag and drop files, or click to select'}
            </p>
          </>
        )}
        {files.length > 0 && (
          <ul className="w-full max-w-md space-y-2">
            {files.map((file, index) => (
              <li key={file.name} className="flex items-center justify-between text-sm">
                <span className="truncate max-w-[200px] text-gray-700">{file.name} ({formatFileSize(file.size)})</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(index);
                  }}
                  aria-label="Remove file"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </Button>
              </li>
            ))}
          </ul>
        )}
        {progress.length > 0 && progress.some(p => p < 100) && (
          <Progress value={progress.reduce((a, b) => a + b, 0) / progress.length} className="w-full max-w-md h-1" />
        )}
        {error && (
          <div className="flex items-center space-x-2 text-red-500 text-sm" role="alert">
            <AlertCircle className="w-4 h-4" />
            <p>{error}</p>
          </div>
        )}
        {fileRejections.length > 0 && (
          <div className="flex items-center space-x-2 text-red-500 text-sm" role="alert">
            <AlertCircle className="w-4 h-4" />
            <p>{fileRejections[0].errors[0].message}</p>
          </div>
        )}
        {success && (
          <div className="flex items-center space-x-2 text-green-500 text-sm" role="status">
            <CheckCircle className="w-4 h-4" />
            <p>Upload successful!</p>
          </div>
        )}
        {files.length > 0 && !success && (
          <Button 
            onClick={(e) => {
              e.stopPropagation();
              handleUpload();
            }}
            disabled={isUploading}
            className="mt-2"
            variant="default"
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              'Upload'
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
