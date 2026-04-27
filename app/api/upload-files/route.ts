import { NextRequest, NextResponse } from 'next/server';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import { 
  validateFile, 
  validateFileTypeByContent, 
  ensureUploadDirectory,
  createReportDirectory,
  saveFileToSupabase 
} from '@/lib/fileStorage';

// Update for Next.js 14 App Router
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    // Ensure upload directory exists
    ensureUploadDirectory();

    // Parse the form data
    const formData = await new Promise<{ fields: formidable.Fields; files: formidable.Files }>((resolve, reject) => {
      const form = new formidable.IncomingForm({
        uploadDir: '/tmp', // Temporary directory for uploads
        keepExtensions: true,
        maxFileSize: 10 * 1024 * 1024, // 10MB
      });
      form.parse(request as any, (err, fields, files) => {
        if (err) {
          reject(err);
        } else {
          resolve({ fields, files });
        }
      });
    });

    // Extract the report subject from the fields
    const subject = Array.isArray(formData.fields.subject) 
      ? formData.fields.subject[0] 
      : formData.fields.subject;
    
    if (!subject) {
      return NextResponse.json(
        { error: 'Report subject is required' },
        { status: 400 }
      );
    }

    // Validate report subject
    // Importing this function to verify the subject is safe
    // We'll implement the validation in the fileStorage.ts file later
    // For now we'll just make sure it's present

    // Create directory for the report
    const { dirPath } = createReportDirectory(subject as string);

    // Process uploaded files
    const files = formData.files.files;
    const savedFiles = [];

    if (Array.isArray(files)) {
      for (const file of files) {
        // Validate file type and size
        validateFile(file as any);

        // Read file buffer for content validation
        const buffer = fs.readFileSync(file.filepath);
        
        // Validate file type by content (magic bytes)
        validateFileTypeByContent(buffer, file.mimetype || '');
        
        // Save the file to the report directory
        const savedFile = await saveFileToSupabase(buffer, file.originalFilename || '', dirPath, file.mimetype || '');
        
        // Remove temporary file
        fs.unlinkSync(file.filepath);
        
        savedFiles.push({
          originalName: savedFile.originalName,
          uniqueName: savedFile.uniqueFileName,
          path: savedFile.filePath
        });
      }
    } else if (files) {
      // Handle single file
      validateFile(files as any);
      
      const buffer = fs.readFileSync((files as any).filepath);
      validateFileTypeByContent(buffer, (files as any).mimetype || '');
      
      const savedFile = await saveFileToSupabase(buffer, (files as any).originalFilename || '', dirPath, (files as any).mimetype || '');
      fs.unlinkSync((files as any).filepath);
      
      savedFiles.push({
        originalName: savedFile.originalName,
        uniqueName: savedFile.uniqueFileName,
        path: savedFile.filePath
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Files uploaded successfully',
      files: savedFiles,
      reportDirectory: dirPath
    });

  } catch (error) {
    console.error('Error uploading files:', error);
    
    // Clean up any uploaded files in case of error
    if (error instanceof Error && error.message.includes('File')) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to upload files' },
      { status: 500 }
    );
  }
}