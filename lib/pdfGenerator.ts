import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { DeklarasiData } from '@/types/deklarasi';

export const generateDeklarasiPDF = (deklarasi: DeklarasiData) => {
  const doc = new jsPDF();
  
  // Title
  doc.setFontSize(18);
  doc.text('FORMULIR DEKLARASI BENTURAN KEPENTINGAN', 105, 20, { align: 'center' });
  
  doc.setFontSize(12);
  doc.text('Sistem Whistleblowing & Deklarasi Benturan Kepentingan - UKPBJ Kementerian Ketenagakerjaan', 105, 30, { align: 'center' });
  
  // Add some spacing
  let yPosition = 45;
  
  // Data Diri Section
  doc.setFontSize(14);
  doc.text('DATA DIRI PEGAWAI', 20, yPosition);
  doc.line(20, yPosition + 2, 190, yPosition + 2); // Underline
  
  doc.setFontSize(12);
  yPosition += 10;
  
  // Add personal information
  doc.text(`ID Deklarasi: ${deklarasi.id || ''}`, 20, yPosition);
  yPosition += 8;
  
  doc.text(`Nama Lengkap: ${deklarasi.namaLengkap || ''}`, 20, yPosition);
  yPosition += 8;
  
  doc.text(`NIP/NIK: ${deklarasi.nipNik || ''}`, 20, yPosition);
  yPosition += 8;
  
  doc.text(`Jabatan: ${deklarasi.jabatan || ''}`, 20, yPosition);
  yPosition += 8;
  
  doc.text(`Satuan Kerja: ${deklarasi.satuanKerja || ''}`, 20, yPosition);
  yPosition += 12;
  
  // Detail Benturan Kepentingan
  doc.setFontSize(14);
  doc.text('DETAIL BENTURAN KEPENTINGAN', 20, yPosition);
  doc.line(20, yPosition + 2, 190, yPosition + 2); // Underline
  
  doc.setFontSize(12);
  yPosition += 10;
  
  doc.text(`Nama Kegiatan/Paket: ${deklarasi.namaKegiatan || ''}`, 20, yPosition);
  yPosition += 8;
  
  doc.text(`Pihak Terkait: ${deklarasi.pihakTerkait || ''}`, 20, yPosition);
  yPosition += 8;
  
  doc.text(`Bentuk Hubungan: ${deklarasi.bentukHubungan || ''}`, 20, yPosition);
  yPosition += 8;
  
  // Add the detailed description with proper formatting
  doc.text('Uraian Detail Hubungan & Potensi Benturan:', 20, yPosition);
  yPosition += 6;
  
  // Split the detailed description into lines and add them
  const splitText = doc.splitTextToSize(deklarasi.uraianDetail || '', 170);
  splitText.forEach((line: string) => {
    if (yPosition > 270) { // Check if we're near the bottom of the page
      doc.addPage();
      yPosition = 20;
    }
    doc.text(line, 20, yPosition);
    yPosition += 6;
  });
  
  yPosition += 6;
  
  doc.text(`Waktu Pengiriman: ${deklarasi.waktuKirim || ''}`, 20, yPosition);
  yPosition += 10;
  
  // Status, Priority and Assignment (as a table for better formatting)
  const statusInfo = [
    ['Status', deklarasi.status || ''],
    ['Prioritas', deklarasi.priority || ''],
    ['Ditugaskan Kepada', deklarasi.assignedTo || '']
  ];
  
  autoTable(doc, {
    startY: yPosition,
    head: [['Field', 'Value']],
    body: statusInfo,
    theme: 'grid',
    styles: { 
      fontSize: 10,
      cellPadding: 3 
    },
    headStyles: { 
      fillColor: [59, 130, 246], // blue-500
      textColor: [255, 255, 255] 
    },
  });
  
  // Add a note at the bottom
  // Using yPosition after the table instead of doc.lastAutoTable for compatibility
  const finalY = yPosition + 20; // Fixed position after the table
  doc.setFontSize(10);
  doc.text('* Dokumen ini dicetak secara otomatis dari sistem dan sah tanpa tanda tangan.', 20, finalY);
  
  // Save the PDF
  doc.save(`deklarasi-${deklarasi.id}.pdf`);
};
