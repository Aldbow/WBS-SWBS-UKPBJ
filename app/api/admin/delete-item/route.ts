import { NextRequest, NextResponse } from 'next/server';
import { getSheetData, deleteSheetRow } from '@/lib/googleSheets';

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

export async function POST(request: NextRequest) {
  try {
    // Verify admin token
    if (!verifyToken(request)) {
      console.log('Unauthorized access attempt to delete item');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id, sheetType } = await request.json();

    if (!id || !sheetType) {
      return NextResponse.json(
        { error: 'Missing required fields: id, sheetType' },
        { status: 400 }
      );
    }

    let sheetId, sheetName;
    
    if (sheetType === 'laporan') {
      sheetId = process.env.SHEET_ID_LAPORAN;
      sheetName = 'SWBS-Laporan-Pelanggaran';
    } else if (sheetType === 'deklarasi') {
      sheetId = process.env.SHEET_ID_DEKLARASI;
      sheetName = 'SWBS-Deklarasi-Benturan-Kepentingan';
    } else {
      return NextResponse.json(
        { error: 'Invalid sheet type' },
        { status: 400 }
      );
    }

    if (!sheetId) {
      const envVar = sheetType === 'laporan' ? 'SHEET_ID_LAPORAN' : 'SHEET_ID_DEKLARASI';
      console.error(`${envVar} is not configured`);
      return NextResponse.json(
        { error: `Server configuration error: ${envVar} is not set` },
        { status: 500 }
      );
    }

    // Get all IDs to find the row index
    const allRows = await getSheetData(sheetId, `${sheetName}!A:A`);
    
    const rowIndex = allRows.findIndex((row: string[]) => row[0] === id);
    
    if (rowIndex === -1) {
      return NextResponse.json(
        { error: 'ID not found' },
        { status: 404 }
      );
    }

    // Delete the row (rowIndex + 1 because header is row 0, +1 again for 1-indexed sheets)
    await deleteSheetRow(sheetId, rowIndex + 1);

    return NextResponse.json({ 
      success: true, 
      message: `Successfully deleted item with ID: ${id}`,
      id
    });

  } catch (error) {
    console.error('Error deleting item:', error);
    return NextResponse.json(
      { error: 'Failed to delete item' },
      { status: 500 }
    );
  }
}
