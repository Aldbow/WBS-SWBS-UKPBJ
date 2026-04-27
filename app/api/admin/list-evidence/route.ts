import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

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

    // Verify the user is authorized
    if (!verifyToken()) {
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

    // Fetch list of files from Supabase
    const { data, error } = await supabase.storage.from('evidence-files').list(reportDir);

    if (error) {
      console.error('Supabase list error:', error);
      return NextResponse.json(
        { error: 'Failed to list evidence files' },
        { status: 500 }
      );
    }

    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: 'Report directory not found or empty' },
        { status: 404 }
      );
    }

    // Filter out any non-files if needed (supabase might return empty .emptyFolderPlaceholder)
    const fileNames = data
      .filter(file => file.name !== '.emptyFolderPlaceholder')
      .map(file => file.name);

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