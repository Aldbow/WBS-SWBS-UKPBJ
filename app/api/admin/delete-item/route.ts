import { NextRequest, NextResponse } from 'next/server';
import { getSheetData, deleteSheetRow } from '@/lib/googleSheets';
import { verifyToken } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    // Verify admin token
    if (!verifyToken()) {
      console.log('Unauthorized access attempt to delete item');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id, sheetType, linkBukti } = await request.json();

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

    // Delete the row (deleteDimension uses 0-based index)
    await deleteSheetRow(sheetId, sheetName, rowIndex);

    // Delete associated files from Supabase Storage if applicable
    if (sheetType === 'laporan' && linkBukti) {
      try {
        const { data: files, error: listError } = await supabase.storage.from('evidence-files').list(linkBukti);
        if (!listError && files && files.length > 0) {
          const filesToRemove = files.map(file => `${linkBukti}/${file.name}`);
          const { error: removeError } = await supabase.storage.from('evidence-files').remove(filesToRemove);
          if (removeError) {
            console.error('Failed to remove some files from Supabase:', removeError);
          } else {
            console.log(`Successfully removed ${files.length} files from Supabase bucket.`);
          }
        }
      } catch (storageError) {
        console.error('Error during Supabase file deletion:', storageError);
      }
    }

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
