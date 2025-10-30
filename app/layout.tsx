import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "SWBS - Sistem Whistleblowing | UKPBJ Kemnaker",
    template: "%s | SWBS UKPBJ Kemnaker",
  },
  description: "Sistem Whistleblowing & Deklarasi Benturan Kepentingan - Unit Kerja Pengadaan Barang/Jasa Kementerian Ketenagakerjaan",
  keywords: ["whistleblowing", "benturan kepentingan", "UKPBJ", "Kemnaker", "pelaporan pelanggaran", "conflict of interest", "procurement"],
  authors: [{ name: "UKPBJ Kementerian Ketenagakerjaan" }],
  creator: "UKPBJ Kementerian Ketenagakerjaan",
  publisher: "Kementerian Ketenagakerjaan",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    title: "SWBS - Sistem Whistleblowing | UKPBJ Kemnaker",
    description: "Sistem Whistleblowing & Deklarasi Benturan Kepentingan - Unit Kerja Pengadaan Barang/Jasa Kementerian Ketenagakerjaan",
    siteName: "SWBS UKPBJ Kemnaker",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
