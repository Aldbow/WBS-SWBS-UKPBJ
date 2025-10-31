import { NextRequest, NextResponse } from 'next/server';
import { appendToSheet } from '@/lib/googleSheets';
import { SubmitDeklarasiRequest } from '@/types/deklarasi';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json() as SubmitDeklarasiRequest;

    // Generate ID
    const id = `DK-${Date.now()}`;
    const waktuKirim = new Date().toLocaleString('id-ID', {
      timeZone: 'Asia/Jakarta',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    // Append to Google Sheets
    const sheetId = process.env.SHEET_ID_DEKLARASI!;
    const values = [
      id,
      waktuKirim,
      data.namaLengkap || '',
      data.nipNik || '',
      data.jabatan || '',
      data.peranKegiatan || '',
      data.satuanKerja || '',
      data.namaKegiatan || '',
      data.pihakTerkait || '',
      data.bentukHubungan || '',
      data.uraianDetail || '',
      data.keluarga || '',
      data.keuangan || '',
      data.hadiah || '',
      data.pekerjaan || '',
      data.kepentingan || '',
      data.lainnya || '',
      data.lainnyaLainnya || '',
    ];

    await appendToSheet(sheetId, 'Sheet1!A:J', values);

    return NextResponse.json({ 
      success: true,
      message: 'Deklarasi berhasil dikirim',
      id 
    });

  } catch (error) {
    console.error('Error submitting deklarasi:', error);
    return NextResponse.json(
      { error: 'Gagal mengirim deklarasi' },
      { status: 500 }
    );
  }
}
