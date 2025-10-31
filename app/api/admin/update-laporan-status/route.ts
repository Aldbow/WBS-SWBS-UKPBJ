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

export async function PUT(request: NextRequest) {
  try {
    console.log('Updating laporan status...');
    
    // Verify admin token
    if (!verifyToken(request)) {
      console.log('Unauthorized access attempt to update laporan status');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { reportId, newStatus } = await request.json();

    if (!reportId || !newStatus) {
      console.log('Missing required parameters for updating status');
      return NextResponse.json(
        { error: 'Report ID and new status are required' },
        { status: 400 }
      );
    }

    console.log(`Updating status for report ${reportId} to ${newStatus}`);
    
    const sheetId = process.env.SHEET_ID_LAPORAN;
    if (!sheetId) {
      console.error('SHEET_ID_LAPORAN is not configured');
      return NextResponse.json(
        { error: 'Server configuration error: SHEET_ID_LAPORAN is not set' },
        { status: 500 }
      );
    }
    
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
      console.log(`Report with ID ${reportId} not found in Google Sheets`);
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
    
    console.log(`Successfully updated status for report ${reportId} to ${newStatus}`);

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