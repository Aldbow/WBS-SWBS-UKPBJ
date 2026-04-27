import { NextRequest, NextResponse } from 'next/server';
import { getSheetData } from '@/lib/googleSheets';
import { DeklarasiData } from '@/types/deklarasi';
import { verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    console.log('Fetching deklarasi data...');
    
    // Verify admin token
    if (!verifyToken()) {
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
    const rows = await getSheetData(sheetId, 'SWBS-Deklarasi-Benturan-Kepentingan!A2:R'); // Columns A-R only
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
