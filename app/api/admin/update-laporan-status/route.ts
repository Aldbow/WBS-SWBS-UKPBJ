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

export async function PUT(request: NextRequest) {
  // Functionality removed as status column has been removed from the spreadsheet
  return NextResponse.json(
    { 
      error: 'Fungsi update status telah dihapus karena kolom status telah dihapus dari spreadsheet.' 
    },
    { status: 404 } // Not Found
  );
}