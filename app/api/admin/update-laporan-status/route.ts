import { NextRequest, NextResponse } from 'next/server';
import { getSheetData, updateSheetData } from '@/lib/googleSheets';
import { verifyToken } from '@/lib/auth';

export async function PUT(request: NextRequest) {
  // Functionality removed as status column has been removed from the spreadsheet
  return NextResponse.json(
    { 
      error: 'Fungsi update status telah dihapus karena kolom status telah dihapus dari spreadsheet.' 
    },
    { status: 404 } // Not Found
  );
}