import { NextRequest, NextResponse } from 'next/server';
import { getSheetData, updateSheetData } from '@/lib/googleSheets';

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
      console.log('Unauthorized access attempt to update status');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id, newStatus, newPriority, newAssignment, sheetType } = await request.json();

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

    // Validate assignment if provided (basic validation - just check it's a string)
    if (newAssignment && typeof newAssignment !== 'string') {
      return NextResponse.json(
        { error: 'Invalid assignment value' },
        { status: 400 }
      );
    }

    // At least one field must be provided for update
    if (!newStatus && !newPriority && !newAssignment) {
      return NextResponse.json(
        { error: 'At least one field must be provided: status, priority, or assignment' },
        { status: 400 }
      );
    }

    let sheetId, sheetName, idColumn, statusColumn, priorityColumn, assignedToColumn;
    
    if (sheetType === 'laporan') {
      sheetId = process.env.SHEET_ID_LAPORAN;
      sheetName = 'SWBS-Laporan-Pelanggaran';
      idColumn = 'A'; // ID column
      statusColumn = 'H'; // Status column
      priorityColumn = 'I'; // Priority column
      assignedToColumn = 'J'; // Assignment column
    } else if (sheetType === 'deklarasi') {
      sheetId = process.env.SHEET_ID_DEKLARASI;
      sheetName = 'SWBS-Deklarasi-Benturan-Kepentingan';
      idColumn = 'A'; // ID column
      statusColumn = 'S'; // Status column (after the existing columns)
      priorityColumn = 'T'; // Priority column
      assignedToColumn = 'U'; // Assignment column
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
      const updateRange = `${sheetName}!${statusColumn}${rowIndex + 2}`;
      await updateSheetData(sheetId, updateRange, [[newStatus]]);
      updates.push(`Status to ${newStatus}`);
    }
    
    if (newPriority) {
      const updateRange = `${sheetName}!${priorityColumn}${rowIndex + 2}`;
      await updateSheetData(sheetId, updateRange, [[newPriority]]);
      updates.push(`Priority to ${newPriority}`);
    }
    
    if (newAssignment) {
      const updateRange = `${sheetName}!${assignedToColumn}${rowIndex + 2}`;
      await updateSheetData(sheetId, updateRange, [[newAssignment]]);
      updates.push(`Assignment to ${newAssignment}`);
    }

    return NextResponse.json({ 
      success: true, 
      message: `Updated: ${updates.join(', ')}`,
      id,
      ...(newStatus && { newStatus }),
      ...(newPriority && { newPriority }),
      ...(newAssignment && { newAssignment })
    });

  } catch (error) {
    console.error('Error updating status:', error);
    return NextResponse.json(
      { error: 'Failed to update status' },
      { status: 500 }
    );
  }
}