import { NextRequest, NextResponse } from 'next/server';
import { getSheetData } from '@/lib/googleSheets';

function verifyToken(request: NextRequest): boolean {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return false;
    }

    const token = authHeader.substring(7);
    
    // Verify simple token format (base64 encoded string with admin ID)
    try {
      const decodedToken = Buffer.from(token, 'base64').toString('utf-8');
      const [adminId, timestamp] = decodedToken.split(':');
      
      // Basic validation: check if format is correct and timestamp is not too old (8 hours)
      if (!adminId || !timestamp) {
        return false;
      }
      
      const tokenTime = parseInt(timestamp);
      const currentTime = Date.now();
      const maxAge = 8 * 60 * 60 * 1000; // 8 hours in milliseconds
      
      if (isNaN(tokenTime)) {
        return false; // Invalid timestamp
      }
      
      if (currentTime - tokenTime > maxAge) {
        return false; // Token expired
      }
      
      return true;
    } catch {
      return false;
    }
  } catch (error) {
    console.error('Token verification failed:', error);
    return false;
  }
}

export async function GET(request: NextRequest) {
  try {
    console.log('Fetching laporan data...');
    
    // Verify admin token
    if (!verifyToken(request)) {
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
    const rows = await getSheetData(sheetId, 'SWBS-Laporan-Pelanggaran!A2:I'); // Include status and priority columns (H, I)
    console.log(`Fetched ${rows.length} rows of laporan data`);

    const data = rows.map((row: any[], index: number) => ({
      id: row[0] || '',
      waktuPelaporan: row[1] || '',
      kategori: row[2] || '',
      waktuKejadian: row[3] || '',
      subjek: row[4] || '',
      isiLaporan: row[5] || '',
      linkBukti: row[6] || '',
      status: row[7] || 'Baru', // Default to 'Baru' if no status is set
      priority: row[8] || 'Normal', // Default to 'Normal' if no priority is set
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
