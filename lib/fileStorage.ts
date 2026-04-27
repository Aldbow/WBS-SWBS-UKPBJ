import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from './supabase';

// Define allowed file types and maximum size (10MB)
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/jpg', 
  'image/png',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes

// Base directory for uploads
const UPLOAD_BASE_DIR = path.join(process.cwd(), 'storage', 'report_uploads');

/**
 * Stub function to maintain compatibility.
 * Local upload directory is no longer required with Supabase.
 */
export const ensureUploadDirectory = () => {
  // No-op for Supabase
};

/**
 * Validates file type and size
 */
export const validateFile = (file: {
  originalname: string;
  mimetype: string;
  size: number;
}) => {
  // Validate file size
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`File size exceeds maximum limit of ${MAX_FILE_SIZE / (1024 * 1024)}MB`);
  }

  // Validate MIME type
  if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    throw new Error(`File type not allowed: ${file.mimetype}`);
  }

  return true;
};

/**
 * Sanitizes the report subject to create a filesystem-safe directory name
 */
export const sanitizeDirectoryName = (subject: string): string => {
  // Replace spaces with underscores and remove special characters
  return subject
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '_') // Replace spaces, hyphens, and multiple underscores with single underscore
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens or underscores
};

/**
 * Generates a unique directory name for a report based on the subject
 */
export const createReportDirectory = (subject: string) => {
  // Generate timestamp
  const timestamp = new Date().toISOString().replace(/[-:T]/g, '').substring(0, 14);
  
  // Sanitize the subject
  const sanitizedSubject = sanitizeDirectoryName(subject);
  
  // Create directory name
  const dirName = `${timestamp}_${sanitizedSubject}`;
  
  return {
    dirName,
    dirPath: dirName // For Supabase, the path is just the folder name prefix
  };
};

/**
 * Saves a file to Supabase Storage with a unique name
 */
export const saveFileToSupabase = async (buffer: Buffer, originalName: string, directory: string, mimeType: string) => {
  // Generate a unique filename to prevent conflicts
  const fileExtension = path.extname(originalName);
  const uniqueFileName = `${uuidv4()}${fileExtension}`;
  
  // Supabase path: folder/filename.ext
  const filePath = `${directory}/${uniqueFileName}`;
  
  // Upload to Supabase
  const { error } = await supabase.storage
    .from('evidence-files')
    .upload(filePath, buffer, {
      contentType: mimeType,
      upsert: false
    });

  if (error) {
    throw new Error(`Failed to upload to Supabase: ${error.message}`);
  }
  
  // Return the path and original name for reference
  return {
    filePath,
    uniqueFileName,
    originalName
  };
};

/**
 * Validates the report subject to ensure it's safe for directory naming
 */
export const validateReportSubject = (subject: string) => {
  if (!subject || subject.trim().length === 0) {
    throw new Error('Report subject is required');
  }
  
  // Check for potentially dangerous directory traversal
  if (subject.includes('../') || subject.includes('..\\')) {
    throw new Error('Invalid report subject');
  }
  
  return true;
};

/**
 * Validates file type based on its content (magic bytes)
 */
export const validateFileTypeByContent = (buffer: Buffer, mimeType: string) => {
  // For image files
  if (mimeType.startsWith('image/')) {
    // Check for common image file signatures
    const imageSignatures = {
      'image/jpeg': [0xFF, 0xD8, 0xFF], // JPEG
      'image/png': [0x89, 0x50, 0x4E, 0x47], // PNG
    };

    const expectedBytes = imageSignatures[mimeType as keyof typeof imageSignatures];
    if (expectedBytes) {
      for (let i = 0; i < expectedBytes.length; i++) {
        if (buffer[i] !== expectedBytes[i]) {
          throw new Error(`File type mismatch: Expected ${mimeType}`);
        }
      }
    }
  }
  
  // For PDF files
  if (mimeType === 'application/pdf') {
    const pdfSignature = [0x25, 0x50, 0x44, 0x46]; // %PDF
    for (let i = 0; i < pdfSignature.length; i++) {
      if (buffer[i] !== pdfSignature[i]) {
        throw new Error(`File type mismatch: Expected PDF`);
      }
    }
  }
  
  // For Word files (basic check)
  if (mimeType === 'application/msword' || 
      mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    // Could add more sophisticated checks here if needed
  }
  
  return true;
};