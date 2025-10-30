import { NextRequest, NextResponse } from 'next/server';
import { getSheetData } from '@/lib/googleSheets';
import jwt from 'jsonwebtoken';

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
