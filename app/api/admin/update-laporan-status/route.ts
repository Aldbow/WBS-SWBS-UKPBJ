import { NextRequest, NextResponse } from 'next/server';
import { getSheetData } from '@/lib/googleSheets';
import jwt from 'jsonwebtoken';
import { updateSheetData } from '@/lib/googleSheets'; // we'll need to create this function

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

export async function PUT(request: NextRequest) {
  try {
    // Verify admin token
    if (!verifyToken(request)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { reportId, newStatus } = await request.json();

    if (!reportId || !newStatus) {
      return NextResponse.json(
        { error: 'Report ID and new status are required' },
        { status: 400 }
      );
    }

    const sheetId = process.env.SHEET_ID_LAPORAN!;
    
    // Get all data to find the row with the report ID
    const rows = await getSheetData(sheetId, 'Sheet1!A:H');
    
    let targetRowIndex = -1;
    for (let i = 0; i < rows.length; i++) {
      if (rows[i][0] === reportId) { // Assuming ID is in column A (index 0)
        targetRowIndex = i;
        break;
      }
    }
    
    if (targetRowIndex === -1) {
      return NextResponse.json(
        { error: 'Report not found' },
        { status: 404 }
      );
    }
    
    // Update the status in column H (index 7)
    const updatedRow = [...rows[targetRowIndex]];
    updatedRow[7] = newStatus; // Status is in column H
    
    // Update the specific row in the Google Sheet
    const updateRange = `Sheet1!A${targetRowIndex + 2}:H${targetRowIndex + 2}`; // +2 because we start from row 2 (row 1 has headers)
    await updateSheetData(sheetId, updateRange, [updatedRow]);

    return NextResponse.json({ 
      success: true, 
      message: 'Status updated successfully',
      data: { reportId, newStatus }
    });

  } catch (error) {
    console.error('Error updating report status:', error);
    return NextResponse.json(
      { error: 'Failed to update report status' },
      { status: 500 }
    );
  }
}