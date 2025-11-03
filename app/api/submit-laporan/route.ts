import { NextRequest } from 'next/server';
import { appendToSheet } from '@/lib/googleSheets';
import fs from 'fs';
import path from 'path';
import { 
  validateFile, 
  validateFileTypeByContent, 
  ensureUploadDirectory,
  createReportDirectory,
  saveFileToDirectory,
  validateReportSubject
} from '@/lib/fileStorage';
import { NextResponse } from 'next/server';

// Disable automatic body parsing for file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(request: NextRequest) {
  try {
    // Ensure upload directory exists
    ensureUploadDirectory();

    // We'll use a different approach to handle form data with files
    // We'll need to parse the request body manually since Next.js RSC doesn't support formidable directly
    const formData = await request.formData();
    
    // Extract form fields from FormData
    const kategori = formData.get('kategori')?.toString() || '';
    const waktuKejadian = formData.get('waktuKejadian')?.toString() || '';
    const subjek = formData.get('subjek')?.toString() || '';
    const isiLaporan = formData.get('isiLaporan')?.toString() || '';

    // Validate required fields
    if (!subjek) {
      return NextResponse.json(
        { error: 'Subject is required' },
        { status: 400 }
      );
    }

    // Validate report subject
    validateReportSubject(subjek as string);

    // Generate ID and timestamp
    const id = `LP-${Date.now()}`;
    const waktuPelaporan = new Date().toLocaleString('id-ID', {
      timeZone: 'Asia/Jakarta',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    // Create directory for the report
    const { dirPath } = createReportDirectory(subjek as string);

    // Process uploaded files if any
    let linkBukti = '';
    const files = formData.getAll('files') as File[];
    
    if (files.length > 0) {
      const savedFiles = [];

      for (const file of files) {
        // Convert the File object to buffer for validation
        const buffer = await file.arrayBuffer();
        const bufferTyped = Buffer.from(buffer);
        
        // Validate file size
        if (file.size > 10 * 1024 * 1024) { // 10MB
          throw new Error(`File size exceeds maximum limit of 10MB: ${file.name}`);
        }

        // Validate MIME type
        const ALLOWED_MIME_TYPES = [
          'image/jpeg',
          'image/jpg', 
          'image/png',
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ];
        
        if (!ALLOWED_MIME_TYPES.includes(file.type)) {
          throw new Error(`File type not allowed: ${file.type}`);
        }

        // Validate file type by content (magic bytes)
        validateFileTypeByContent(bufferTyped, file.type);
        
        // Save the file to the report directory
        const savedFile = saveFileToDirectory(bufferTyped, file.name, dirPath);
        
        savedFiles.push(savedFile.uniqueFileName);
      }

      // For now, just set a placeholder since we're storing files locally
      // In a real system, you might create a secure endpoint to access these files
      linkBukti = `files://${dirPath}`; // This is just a reference to the local directory
    }

    // Append to Google Sheets
    const sheetId = process.env.SHEET_ID_LAPORAN!;
    const values = [
      id,
      waktuPelaporan,
      kategori,
      waktuKejadian,
      subjek,
      isiLaporan,
      linkBukti, // Now we have file references
      'Baru', // Status
      'Normal', // Priority
      '' // Assignment (assigned admin)
    ];

    await appendToSheet(sheetId, 'SWBS-Laporan-Pelanggaran!A:J', values);

    return NextResponse.json({ 
      success: true,
      message: 'Laporan berhasil dikirim',
      id 
    });

  } catch (error) {
    console.error('Error submitting laporan:', error);
    
    // Clean up any temporary files in case of error
    if (error instanceof Error && error.message.includes('File')) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Gagal mengirim laporan' },
      { status: 500 }
    );
  }
}
