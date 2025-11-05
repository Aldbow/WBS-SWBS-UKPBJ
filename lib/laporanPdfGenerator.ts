import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { LaporanData } from '@/types/data';

// This is a simplified version for laporan data - we'll define the interface directly here
interface LaporanPDFData extends LaporanData {
  evidenceFiles?: string[]; // Optional array of evidence file names
}

export const generateLaporanPDF = (laporan: LaporanPDFData) => {
  const doc = new jsPDF();
  
  // Title
  doc.setFontSize(18);
  doc.text('FORMULIR LAPORAN PELANGGARAN', 105, 20, { align: 'center' });
  
  doc.setFontSize(12);
  doc.text('Sistem Whistleblowing & Deklarasi Benturan Kepentingan - UKPBJ Kementerian Ketenagakerjaan', 105, 30, { align: 'center' });
  
  // Add some spacing
  let yPosition = 45;
  
  // Laporan Information
  doc.setFontSize(14);
  doc.text('INFORMASI LAPORAN', 20, yPosition);
  doc.line(20, yPosition + 2, 190, yPosition + 2); // Underline
  
  doc.setFontSize(12);
  yPosition += 10;
  
  // Add laporan information
  doc.text(`ID Laporan: ${laporan.id || ''}`, 20, yPosition);
  yPosition += 8;
  
  doc.text(`Waktu Pelaporan: ${laporan.waktuPelaporan || ''}`, 20, yPosition);
  yPosition += 8;
  
  doc.text(`Kategori Pelanggaran: ${laporan.kategori || ''}`, 20, yPosition);
  yPosition += 8;
  
  doc.text(`Waktu Kejadian: ${laporan.waktuKejadian || ''}`, 20, yPosition);
  yPosition += 8;
  
  doc.text(`Subjek Pelaporan: ${laporan.subjek || ''}`, 20, yPosition);
  yPosition += 12;
  
  // Isi Laporan
  doc.setFontSize(14);
  doc.text('ISI LAPORAN', 20, yPosition);
  doc.line(20, yPosition + 2, 190, yPosition + 2); // Underline
  
  doc.setFontSize(12);
  yPosition += 10;
  
  // Add the detailed description with proper formatting
  doc.text('Isi Laporan:', 20, yPosition);
  yPosition += 6;
  
  // Split the detailed description into lines and add them
  const splitText = doc.splitTextToSize(laporan.isiLaporan || '', 170);
  splitText.forEach((line: string) => {
    if (yPosition > 270) { // Check if we're near the bottom of the page
      doc.addPage();
      yPosition = 20;
    }
    doc.text(line, 20, yPosition);
    yPosition += 6;
  });
  
  yPosition += 6;
  
  // Evidence files section
  if (laporan.evidenceFiles && laporan.evidenceFiles.length > 0) {
    doc.setFontSize(14);
    doc.text('BUKTI PELANGGARAN', 20, yPosition);
    doc.line(20, yPosition + 2, 190, yPosition + 2); // Underline
    yPosition += 10;
    
    doc.setFontSize(12);
    doc.text('File Bukti:', 20, yPosition);
    yPosition += 6;
    
    // Add file names
    laporan.evidenceFiles.forEach((fileName, index) => {
      doc.text(`• ${fileName}`, 25, yPosition);
      yPosition += 6;
    });
    
    yPosition += 6; // Extra space after evidence files list
  }
  
  // Status, Priority and Assignment (as a table for better formatting)
  if (laporan.status || laporan.priority || laporan.assignedTo) {
    const statusInfo = [
      ['Status', laporan.status || ''],
      ['Prioritas', laporan.priority || ''],
      ['Ditugaskan Kepada', laporan.assignedTo || '']
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
  }
  
  // Add a note at the bottom
  // For now, we'll use a simpler approach since lastAutoTable might not be available in all versions
  const finalY = yPosition + 20; // Use a fixed position after the table
  doc.setFontSize(10);
  doc.text('* Dokumen ini dicetak secara otomatis dari sistem dan sah tanpa tanda tangan.', 20, finalY);
  
  // Save the PDF
  doc.save(`laporan-${laporan.id}.pdf`);
};