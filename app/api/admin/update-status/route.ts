import { NextRequest, NextResponse } from 'next/server';
import { getSheetData, updateSheetData } from '@/lib/googleSheets';
import { verifyToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    // Verify admin token
    if (!verifyToken()) {
      console.log('Unauthorized access attempt to update status');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id, newStatus, newPriority, sheetType } = await request.json();

    if (!id || !sheetType) {
      return NextResponse.json(
        { error: 'Missing required fields: id, sheetType' },
        { status: 400 }
      );
    }

    // Validate status values if provided
    if (newStatus) {
      const validStatuses = ['Baru', 'Ditinjau', 'Selesai'];
      if (!validStatuses.includes(newStatus)) {
        return NextResponse.json(
          { error: 'Invalid status value' },
          { status: 400 }
        );
      }
    }

    // Validate priority values if provided
    if (newPriority) {
      const validPriorities = ['Rendah', 'Normal', 'Tinggi', 'Kritis'];
      if (!validPriorities.includes(newPriority)) {
        return NextResponse.json(
          { error: 'Invalid priority value' },
          { status: 400 }
        );
      }
    }

    // At least one field must be provided for update
    if (!newStatus && !newPriority) {
      return NextResponse.json(
        { error: 'At least one field must be provided: status or priority' },
        { status: 400 }
      );
    }

    let sheetId, sheetName, idColumn, statusColumn, priorityColumn;
    
    if (sheetType === 'laporan') {
      sheetId = process.env.SHEET_ID_LAPORAN;
      sheetName = 'SWBS-Laporan-Pelanggaran';
      idColumn = 'A'; // ID column
      statusColumn = 'H'; // Status column
      priorityColumn = 'I'; // Priority column
    } else if (sheetType === 'deklarasi') {
      sheetId = process.env.SHEET_ID_DEKLARASI;
      sheetName = 'SWBS-Deklarasi-Benturan-Kepentingan';
      idColumn = 'A'; // ID column
      statusColumn = 'S'; // Status column (after the existing columns)
      priorityColumn = 'T'; // Priority column
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

    // Find the row with the given ID
    const allRows = await getSheetData(sheetId, `${sheetName}!A:A`); // Get all ID values to find the row index
    
    const rowIndex = allRows.findIndex(row => row[0] === id);
    if (rowIndex === -1) {
      return NextResponse.json(
        { error: 'ID not found' },
        { status: 404 }
      );
    }

    // Update fields based on what was provided
    const updates = [];
    
    if (newStatus) {
      const updateRange = `${sheetName}!${statusColumn}${rowIndex + 1}`;
      await updateSheetData(sheetId, updateRange, [[newStatus]]);
      updates.push(`Status to ${newStatus}`);
    }
    
    if (newPriority) {
      const updateRange = `${sheetName}!${priorityColumn}${rowIndex + 1}`;
      await updateSheetData(sheetId, updateRange, [[newPriority]]);
      updates.push(`Priority to ${newPriority}`);
    }

    return NextResponse.json({ 
      success: true, 
      message: `Updated: ${updates.join(', ')}`,
      id,
      ...(newStatus && { newStatus }),
      ...(newPriority && { newPriority })
    });

  } catch (error) {
    console.error('Error updating status:', error);
    return NextResponse.json(
      { error: 'Failed to update status' },
      { status: 500 }
    );
  }
}