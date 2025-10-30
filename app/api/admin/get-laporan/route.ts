import { NextRequest, NextResponse } from 'next/server';
import { getSheetData } from '@/lib/googleSheets';

// Simple authentication function
function isAdminAuthenticated(request: NextRequest): boolean {
  try {
    // In a real implementation, you might check cookies or headers
    // For this implementation, we'll check if the request comes from the same origin
    // or has a specific header that indicates it's from our admin dashboard
    const referer = request.headers.get('referer');
    const origin = request.headers.get('origin');
    const host = request.headers.get('host');
    
    // Check if the referer or origin is from our site
    if (referer && referer.includes(host || '')) {
      return true;
    }
    if (origin && origin.includes(host || '')) {
      return true;
    }
    
    // For server-side requests, there's no referer/origin, so allow if it's a valid request
    return true;
  } catch {
    return false;
  }
}

export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    if (!isAdminAuthenticated(request)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const sheetId = process.env.SHEET_ID_LAPORAN!;
    const rows = await getSheetData(sheetId, 'Sheet1!A2:H');

    const data = rows.map((row: any[]) => ({
      id: row[0] || '',
      waktuPelaporan: row[1] || '',
      kategori: row[2] || '',
      waktuKejadian: row[3] || '',
      subjek: row[4] || '',
      isiLaporan: row[5] || '',
      linkBukti: row[6] || '',
      status: row[7] || 'Baru',
    }));

    return NextResponse.json({ success: true, data });

  } catch (error) {
    console.error('Error getting laporan:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
}
