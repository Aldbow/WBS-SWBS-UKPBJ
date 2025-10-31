import { NextRequest, NextResponse } from 'next/server';
import { getSheetData } from '@/lib/googleSheets';
import jwt from 'jsonwebtoken';
import { DeklarasiData } from '@/types/deklarasi';

function verifyToken(request: NextRequest): boolean {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return false;
    }

    const token = authHeader.substring(7);
    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      return false;
    }

    jwt.verify(token, jwtSecret);
    return true;
  } catch {
    return false;
  }
}

export async function GET(request: NextRequest) {
  try {
    // Verify admin token
    if (!verifyToken(request)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const sheetId = process.env.SHEET_ID_DEKLARASI!;
    const rows = await getSheetData(sheetId, 'Sheet1!A2:S');

    const data = rows.map((row: any[]) => ({
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

    return NextResponse.json({ success: true, data } as { success: boolean; data: DeklarasiData[] });

  } catch (error) {
    console.error('Error getting deklarasi:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
}
