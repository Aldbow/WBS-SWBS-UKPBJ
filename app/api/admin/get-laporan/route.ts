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
