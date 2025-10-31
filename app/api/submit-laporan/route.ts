import { NextRequest, NextResponse } from 'next/server';
import { appendToSheet } from '@/lib/googleSheets';

export async function POST(request: NextRequest) {
  try {
    // Parse JSON data instead of form data since file upload is removed
    const fields = await request.json();

    // Generate ID
    const id = `LP-${Date.now()}`;
    const waktuPelaporan = new Date().toLocaleString('id-ID', {
      timeZone: 'Asia/Jakarta',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    // Append to Google Sheets
    const sheetId = process.env.SHEET_ID_LAPORAN!;
    const values = [
      id,
      waktuPelaporan,
      fields.kategori || '',
      fields.waktuKejadian || '',
      fields.subjek || '',
      fields.isiLaporan || '',
      '', // LinkBukti (empty since file upload is removed)
      'Baru' // Status
    ];

    await appendToSheet(sheetId, 'SWBS-Laporan-Pelanggaran!A:H', values);

    return NextResponse.json({ 
      success: true,
      message: 'Laporan berhasil dikirim',
      id 
    });

  } catch (error) {
    console.error('Error submitting laporan:', error);
    return NextResponse.json(
      { error: 'Gagal mengirim laporan' },
      { status: 500 }
    );
  }
}
