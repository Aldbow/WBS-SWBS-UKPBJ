import { NextRequest, NextResponse } from 'next/server';
import { getSheetData } from '@/lib/googleSheets';
import { DeklarasiData } from '@/types/deklarasi';

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
    console.log('Fetching deklarasi data...');
    
    // Verify admin token
    if (!verifyToken(request)) {
      console.log('Unauthorized access attempt to deklarasi data');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const sheetId = process.env.SHEET_ID_DEKLARASI;
    if (!sheetId) {
      console.error('SHEET_ID_DEKLARASI is not configured');
      return NextResponse.json(
        { error: 'Server configuration error: SHEET_ID_DEKLARASI is not set' },
        { status: 500 }
      );
    }

    console.log('Fetching deklarasi data from Google Sheets...');
    const rows = await getSheetData(sheetId, 'SWBS-Deklarasi-Benturan-Kepentingan!A2:T');
    console.log(`Fetched ${rows.length} rows of deklarasi data`);

    const data = rows.map((row: any[], index: number) => ({
      id: row[0] || '',
      waktuKirim: row[1] || '',
      namaLengkap: row[2] || '',
      nipNik: row[3] || '',
      jabatan: row[4] || '',
      peranKegiatan: row[5] || '',
      satuanKerja: row[6] || '',
      namaKegiatan: row[7] || '',
      pihakTerkait: row[8] || '',
      bentukHubungan: row[9] || '',
      uraianDetail: row[10] || '',
      keluarga: row[11] || '',
      keuangan: row[12] || '',
      hadiah: row[13] || '',
      pekerjaan: row[14] || '',
      kepentingan: row[15] || '',
      lainnya: row[16] || '',
      lainnyaLainnya: row[17] || '',
      status: row[18] || 'Baru', // Default to 'Baru' if no status is set
      priority: row[19] || 'Normal', // Default to 'Normal' if no priority is set
    })) as DeklarasiData[];

    console.log(`Successfully processed ${data.length} deklarasi records`);
    return NextResponse.json({ success: true, data } as { success: boolean; data: DeklarasiData[] });

  } catch (error) {
    console.error('Error getting deklarasi:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
}
