import { NextRequest, NextResponse } from 'next/server';
import { getSheetData } from '@/lib/googleSheets';
import { verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    console.log('Fetching laporan data...');
    
    // Verify admin token
    if (!verifyToken()) {
      console.log('Unauthorized access attempt to laporan data');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const sheetId = process.env.SHEET_ID_LAPORAN;
    if (!sheetId) {
      console.error('SHEET_ID_LAPORAN is not configured');
      return NextResponse.json(
        { error: 'Server configuration error: SHEET_ID_LAPORAN is not set' },
        { status: 500 }
      );
    }

    console.log('Fetching laporan data from Google Sheets...');
    const rows = await getSheetData(sheetId, 'SWBS-Laporan-Pelanggaran!A2:I'); // Columns A-I
    console.log(`Fetched ${rows.length} rows of laporan data`);

    const data = rows.map((row: any[], index: number) => ({
      id: row[0] || '',
      waktuPelaporan: row[1] || '',
      kategori: row[2] || '',
      waktuKejadian: row[3] || '',
      subjek: row[4] || '',
      isiLaporan: row[5] || '',
      linkBukti: row[6] || '',
      status: row[7] || 'Baru',
      priority: row[8] || 'Normal',
    }));

    console.log(`Successfully processed ${data.length} laporan records`);
    return NextResponse.json({ success: true, data });

  } catch (error) {
    console.error('Error getting laporan:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
}
