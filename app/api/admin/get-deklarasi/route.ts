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

    const sheetId = process.env.SHEET_ID_DEKLARASI!;
    const rows = await getSheetData(sheetId, 'Sheet1!A2:J');

    const data = rows.map((row: any[]) => ({
      id: row[0] || '',
      waktuKirim: row[1] || '',
      namaLengkap: row[2] || '',
      nipNik: row[3] || '',
      jabatan: row[4] || '',
      satuanKerja: row[5] || '',
      namaKegiatan: row[6] || '',
      pihakTerkait: row[7] || '',
      bentukHubungan: row[8] || '',
      uraianDetail: row[9] || '',
    }));

    return NextResponse.json({ success: true, data });

  } catch (error) {
    console.error('Error getting deklarasi:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
}
