import { NextRequest, NextResponse } from 'next/server';
import { getSheetData } from '@/lib/googleSheets';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const ticketId = searchParams.get('id');

    if (!ticketId) {
      return NextResponse.json({ error: 'ID Tiket diperlukan' }, { status: 400 });
    }

    const isLaporan = ticketId.startsWith('LP-');
    const isDeklarasi = ticketId.startsWith('DK-');

    if (!isLaporan && !isDeklarasi) {
      return NextResponse.json({ error: 'Format ID Tiket tidak valid' }, { status: 400 });
    }

    if (isLaporan) {
      const sheetId = process.env.SHEET_ID_LAPORAN;
      if (!sheetId) throw new Error('SHEET_ID_LAPORAN tidak dikonfigurasi');

      // Fetch all rows to find the matching ID.
      // Since it's row-based, skipping the header.
      const data = await getSheetData(sheetId, 'SWBS-Laporan-Pelanggaran!A2:J');
      
      const match = data.find((row) => row[0] === ticketId);
      
      if (!match) {
        return NextResponse.json({ error: 'Tiket tidak ditemukan' }, { status: 404 });
      }

      // Return safe data
      return NextResponse.json({
        success: true,
        data: {
          id: match[0] || ticketId,
          waktuPengiriman: match[1] || '-',
          jenis: 'Laporan Pelanggaran',
          kategori: match[2] || '-',
          subjek: match[4] || '-',
          status: match[7] || 'Baru'
        }
      });
    } else {
      const sheetId = process.env.SHEET_ID_DEKLARASI;
      if (!sheetId) throw new Error('SHEET_ID_DEKLARASI tidak dikonfigurasi');

      const data = await getSheetData(sheetId, 'SWBS-Deklarasi-Benturan-Kepentingan!A2:U');
      
      const match = data.find((row) => row[0] === ticketId);
      
      if (!match) {
        return NextResponse.json({ error: 'Tiket tidak ditemukan' }, { status: 404 });
      }

      // Return safe data
      return NextResponse.json({
        success: true,
        data: {
          id: match[0] || ticketId,
          waktuPengiriman: match[1] || '-',
          jenis: 'Deklarasi Benturan Kepentingan',
          kategori: 'Deklarasi', // General label
          subjek: match[7] || '-', // namaKegiatan
          status: match[18] || 'Baru'
        }
      });
    }

  } catch (error) {
    console.error('Error fetching ticket data:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan pada server saat mencari tiket' }, { status: 500 });
  }
}
