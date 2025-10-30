import { NextRequest, NextResponse } from 'next/server';
import { appendToSheet } from '@/lib/googleSheets';
import { uploadFileToDrive } from '@/lib/googleDrive';

async function parseForm(req: NextRequest): Promise<{ fields: any; files: any }> {
  const formData = await req.formData();
  const fields: any = {};
  const files: any[] = [];

  formData.forEach((value, key) => {
    if (value instanceof File) {
      files.push({ name: key, file: value });
    } else {
      fields[key] = value;
    }
  });

  return { fields, files };
}

export async function POST(request: NextRequest) {
  try {
    const { fields, files } = await parseForm(request);

    // Upload files to Google Drive
    let fileLinks: string[] = [];
    
    if (files && files.length > 0) {
      const folderId = process.env.DRIVE_FOLDER_ID!;
      
      for (const fileItem of files) {
        const file = fileItem.file;
        const buffer = Buffer.from(await file.arrayBuffer());
        const timestamp = Date.now();
        const fileName = `${timestamp}-${file.name}`;
        
        const result = await uploadFileToDrive(
          buffer,
          fileName,
          file.type,
          folderId
        );
        
        if (result.link) {
          fileLinks.push(result.link);
        }
      }
    }

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
      fileLinks.join(', '),
      'Baru' // Status
    ];

    await appendToSheet(sheetId, 'Sheet1!A:H', values);

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
