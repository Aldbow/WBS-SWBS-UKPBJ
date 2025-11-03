import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { ensureUploadDirectory } from '@/lib/fileStorage';

// This endpoint allows authorized users to view files securely
export async function GET(
  request: NextRequest,
  { params }: { params: { fileName: string } }
) {
  try {
    // Extract the filename from the URL
    const { searchParams } = new URL(request.url);
    const fileName = searchParams.get('fileName');
    const reportDir = searchParams.get('reportDir');
    
    if (!fileName || !reportDir) {
      return NextResponse.json(
        { error: 'File name and report directory are required' },
        { status: 400 }
      );
    }

    // Verify the user is authorized (this is a simplified check)
    // In a real implementation, you would verify admin credentials here
    const isAdmin = searchParams.get('admin') === 'true'; // Simplified check
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized access' },
        { status: 401 }
      );
    }

    // Sanitize inputs to prevent directory traversal
    if (fileName.includes('../') || fileName.includes('..\\') || 
        reportDir.includes('../') || reportDir.includes('..\\')) {
      return NextResponse.json(
        { error: 'Invalid file path' },
        { status: 400 }
      );
    }

    // Construct the full file path
    const uploadDir = path.join(process.cwd(), 'storage', 'report_uploads');
    const fullPath = path.join(uploadDir, reportDir, fileName);

    // Check if the file exists
    if (!fs.existsSync(fullPath)) {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      );
    }

    // Read the file
    const fileBuffer = fs.readFileSync(fullPath);
    const fileExtension = path.extname(fullPath).toLowerCase();
    
    // Set appropriate content type based on file extension
    let contentType = 'application/octet-stream'; // Default
    if (fileExtension === '.jpg' || fileExtension === '.jpeg') {
      contentType = 'image/jpeg';
    } else if (fileExtension === '.png') {
      contentType = 'image/png';
    } else if (fileExtension === '.pdf') {
      contentType = 'application/pdf';
    } else if (fileExtension === '.doc') {
      contentType = 'application/msword';
    } else if (fileExtension === '.docx') {
      contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    }

    // Return the file content
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `inline; filename="${fileName}"`, // Display inline in browser
      },
    });
  } catch (error) {
    console.error('Error accessing file:', error);
    return NextResponse.json(
      { error: 'Failed to access file' },
      { status: 500 }
    );
  }
}