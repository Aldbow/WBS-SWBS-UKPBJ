'use client';

import { useState, useRef, useCallback, ChangeEvent, DragEvent } from 'react';

interface FileUploadProps {
  onFilesSelected: (files: File[]) => void;
  maxFileSize?: number; // in MB
  allowedTypes?: string[]; // e.g., ['image/jpeg', 'image/png', 'application/pdf']
  maxFiles?: number;
}

const FileUpload = ({ 
  onFilesSelected, 
  maxFileSize = 10, 
  allowedTypes = [
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ],
  maxFiles = 5
}: FileUploadProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): boolean => {
    const errors: string[] = [];

    // Check file type
    if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
      errors.push(`Tipe file tidak diizinkan: ${file.name}`);
    }

    // Check file size
    const maxSize = maxFileSize * 1024 * 1024; // Convert MB to bytes
    if (file.size > maxSize) {
      errors.push(`File terlalu besar (${(file.size / (1024 * 1024)).toFixed(2)}MB): ${file.name}. Maksimal ${(maxSize / (1024 * 1024))}MB`);
    }

    // Check total number of files
    if (uploadedFiles.length >= maxFiles) {
      errors.push(`Maksimal ${maxFiles} file dapat diunggah`);
    }

    if (errors.length > 0) {
      setErrors(prev => [...prev, ...errors]);
      return false;
    }

    return true;
  };

  const handleFiles = useCallback((files: FileList) => {
    const validFiles: File[] = [];
    const newErrors: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file && validateFile(file)) {
        // Check if file already exists (same name and size)
        const exists = uploadedFiles.some(
          f => f.name === file.name && f.size === file.size
        );

        if (!exists) {
          validFiles.push(file);
        } else {
          newErrors.push(`File sudah dipilih: ${file.name}`);
        }
      }
    }

    if (newErrors.length > 0) {
      setErrors(prev => [...prev, ...newErrors]);
    }

    if (validFiles.length > 0) {
      const updatedFiles = [...uploadedFiles, ...validFiles];
      setUploadedFiles(updatedFiles);
      onFilesSelected(updatedFiles);
      setErrors([]);
    }
  }, [uploadedFiles, onFilesSelected]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const onDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const removeFile = (index: number) => {
    const updatedFiles = [...uploadedFiles];
    updatedFiles.splice(index, 1);
    setUploadedFiles(updatedFiles);
    onFilesSelected(updatedFiles);
  };

  const clearAll = () => {
    setUploadedFiles([]);
    setErrors([]);
    onFilesSelected([]);
  };

  const openFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="space-y-4">
      {/* Drag and Drop Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          dragActive 
            ? 'border-primary-500 bg-primary-50' 
            : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
        }`}
        onDragEnter={onDrag}
        onDragLeave={onDrag}
        onDragOver={onDrag}
        onDrop={onDrop}
        onClick={openFileDialog}
      >
        <div className="flex flex-col items-center justify-center">
          <div className="text-4xl mb-3">📁</div>
          <p className="font-medium text-gray-700">
            Seret & lepas file di sini, atau klik untuk mencari
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Mendukung: JPG, PNG, PDF, DOC, DOCX (maks. {maxFileSize}MB per file)
          </p>
          <button
            type="button"
            className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
          >
            Pilih File
          </button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleChange}
          className="hidden"
          accept={allowedTypes.join(',')}
        />
      </div>

      {/* Error messages */}
      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <h4 className="text-red-800 font-medium mb-2">Kesalahan:</h4>
          <ul className="list-disc pl-5 space-y-1 text-red-600">
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Uploaded files list */}
      {uploadedFiles.length > 0 && (
        <div className="border rounded-lg p-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-medium text-gray-900">File Terpilih ({uploadedFiles.length})</h3>
            <button
              type="button"
              onClick={clearAll}
              className="text-sm text-red-600 hover:text-red-800"
            >
              Hapus Semua
            </button>
          </div>
          <ul className="space-y-2">
            {uploadedFiles.map((file, index) => (
              <li 
                key={index} 
                className="flex justify-between items-center bg-gray-50 p-3 rounded-md"
              >
                <div className="flex items-center">
                  <span className="text-sm text-gray-600 mr-2">
                    {file.type.startsWith('image/') ? '🖼️' : 
                     file.type === 'application/pdf' ? '📄' : 
                     file.type.includes('word') ? '📝' : '📎'}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-gray-900 truncate max-w-xs">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FileUpload;