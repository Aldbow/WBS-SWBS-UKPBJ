import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { ensureUploadDirectory } from '@/lib/fileStorage';

// This endpoint allows admin to list evidence files for a specific report
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const reportDir = searchParams.get('reportDir');
    
    if (!reportDir) {
      return NextResponse.json(
        { error: 'Report directory is required' },
        { status: 400 }
      );
    }

    // Verify the user is authorized (this is a simplified check)
    // In a real implementation, you would verify admin credentials here
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized access' },
        { status: 401 }
      );
    }

    // Sanitize inputs to prevent directory traversal
    if (reportDir.includes('../') || reportDir.includes('..\\')) {
      return NextResponse.json(
        { error: 'Invalid report directory path' },
        { status: 400 }
      );
    }

    // Construct the full directory path
    const uploadDir = path.join(process.cwd(), 'storage', 'report_uploads');
    const fullDirPath = path.join(uploadDir, reportDir);

    // Check if the directory exists
    if (!fs.existsSync(fullDirPath)) {
      console.error(`Report directory not found: ${fullDirPath}`);
      console.log(`Looking for directory: ${fullDirPath}`);
      console.log(`Upload directory exists: ${fs.existsSync(uploadDir)}`);
      if (fs.existsSync(uploadDir)) {
        console.log(`Contents of upload directory:`, fs.readdirSync(uploadDir));
      }
      
      return NextResponse.json(
        { error: 'Report directory not found' },
        { status: 404 }
      );
    }

    // Read the directory contents
    const files = fs.readdirSync(fullDirPath);
    
    // Filter out any non-files if needed and return file names
    const fileNames = files.filter(file => {
      const filePath = path.join(fullDirPath, file);
      const stat = fs.statSync(filePath);
      return stat.isFile();
    });

    return NextResponse.json({
      success: true,
      files: fileNames,
      count: fileNames.length
    });
  } catch (error) {
    console.error('Error listing evidence files:', error);
    return NextResponse.json(
      { error: 'Failed to list evidence files' },
      { status: 500 }
    );
  }
}