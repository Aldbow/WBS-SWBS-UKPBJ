import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

// This endpoint allows authorized users to view files securely
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
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

    // Verify the user is authorized via HttpOnly cookie
    if (!verifyToken()) {
      return NextResponse.json(
        { error: 'Unauthorized access' },
        { status: 401 }
      );
    }

    // Sanitize inputs
    if (fileName.includes('../') || fileName.includes('..\\') || 
        reportDir.includes('../') || reportDir.includes('..\\')) {
      return NextResponse.json(
        { error: 'Invalid file path' },
        { status: 400 }
      );
    }

    const filePath = `${reportDir}/${fileName}`;

    // Generate a signed URL valid for 60 seconds
    const { data, error } = await supabase.storage
      .from('evidence-files')
      .createSignedUrl(filePath, 60, {
        download: false, // true to force download, false to view in browser
      });

    if (error || !data?.signedUrl) {
      console.error('Error generating signed URL:', error);
      return NextResponse.json(
        { error: 'File not found or failed to generate secure link' },
        { status: 404 }
      );
    }

    // Redirect the user to the signed URL
    return NextResponse.redirect(data.signedUrl);

  } catch (error) {
    console.error('Error accessing file:', error);
    return NextResponse.json(
      { error: 'Failed to access file' },
      { status: 500 }
    );
  }
}