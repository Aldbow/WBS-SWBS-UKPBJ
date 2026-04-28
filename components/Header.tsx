'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logos */}
          <Link href="/" className="flex items-center space-x-4">
            {/* Kementerian Ketenagakerjaan Logo */}
            <div className="flex items-center space-x-3">
              <img
                src="/img/Logo_Kementerian_Ketenagakerjaan_(2016).png"
                alt="Logo Kementerian Ketenagakerjaan"
                className="h-14 w-auto object-contain"
              />
              {/* Vertical divider */}
              <div className="hidden md:block w-px h-10 bg-gray-300"></div>
              {/* UKPBJ Logo */}
              <img
                src="/img/UKPBJ_logo.png"
                alt="Logo UKPBJ"
                className="h-14 w-auto object-contain"
              />
            </div>
            <div className="hidden md:block ml-2">
              <h1 className="text-lg font-bold text-gray-800">Sistem Deklarasi Keterpaksaan Benturan Kepentingan UKPBJ</h1>
              <p className="text-xs text-gray-600">Kementerian Ketenagakerjaan Republik Indonesia</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-gray-700 hover:text-primary-600 transition-colors font-medium">
              Beranda
            </Link>
            <Link href="/laporan" className="text-gray-700 hover:text-primary-600 transition-colors font-medium">
              Buat Laporan
            </Link>
            <Link href="/deklarasi" className="text-gray-700 hover:text-primary-600 transition-colors font-medium">
              Buat Deklarasi
            </Link>
            <Link href="/admin" className="btn-primary">
              Login Admin
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-3 animate-fade-in">
            <Link href="/" className="block py-2 text-gray-700 hover:text-primary-600 transition-colors font-medium">
              Beranda
            </Link>
            <Link href="/laporan" className="block py-2 text-gray-700 hover:text-primary-600 transition-colors font-medium">
              Buat Laporan
            </Link>
            <Link href="/deklarasi" className="block py-2 text-gray-700 hover:text-primary-600 transition-colors font-medium">
              Buat Deklarasi
            </Link>
            <Link href="/admin" className="block py-2 text-primary-600 font-semibold">
              Login Admin
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
