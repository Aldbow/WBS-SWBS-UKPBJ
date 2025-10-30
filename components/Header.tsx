'use client';

import Link from 'next/link';
import { useState } from 'react';
import { motion } from 'framer-motion';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white/80 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-gray-200/50">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-md"
            >
              <span className="text-white font-bold text-xl">WBS</span>
            </motion.div>
            <div className="hidden md:block">
              <motion.h1 
                className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent"
                initial={false}
                animate={{ scale: mobileMenuOpen ? 1 : 1 }}
              >
                SWBS UKPBJ
              </motion.h1>
              <p className="text-xs text-gray-600">Kementerian Ketenagakerjaan</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-blue-600 transition-colors font-medium relative group">
              Beranda
              <motion.div 
                className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 rounded-full group-hover:w-full transition-all duration-300"
                layoutId="navIndicator"
              />
            </Link>
            <Link href="/laporan" className="text-gray-700 hover:text-blue-600 transition-colors font-medium relative group">
              Buat Laporan
              <motion.div 
                className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 rounded-full group-hover:w-full transition-all duration-300"
                layoutId="navIndicator"
              />
            </Link>
            <Link href="/deklarasi" className="text-gray-700 hover:text-blue-600 transition-colors font-medium relative group">
              Buat Deklarasi
              <motion.div 
                className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 rounded-full group-hover:w-full transition-all duration-300"
                layoutId="navIndicator"
              />
            </Link>
            <Link 
              href="/admin" 
              className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-lg font-medium shadow hover:shadow-md transition-all duration-300 relative group"
            >
              Login Admin
              <motion.div 
                className="absolute inset-0 bg-white/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            whileTap={{ scale: 0.95 }}
          >
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <motion.path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M6 18L18 6M6 6l12 12"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.3 }}
                />
              ) : (
                <motion.path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M4 6h16M4 12h16M4 18h16"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </svg>
          </motion.button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden mt-4 pb-4 space-y-4 overflow-hidden"
          >
            <Link href="/" className="block py-3 text-gray-700 hover:text-blue-600 transition-colors font-medium border-b border-gray-100">
              Beranda
            </Link>
            <Link href="/laporan" className="block py-3 text-gray-700 hover:text-blue-600 transition-colors font-medium border-b border-gray-100">
              Buat Laporan
            </Link>
            <Link href="/deklarasi" className="block py-3 text-gray-700 hover:text-blue-600 transition-colors font-medium border-b border-gray-100">
              Buat Deklarasi
            </Link>
            <Link 
              href="/admin" 
              className="block py-3 text-center bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-lg font-medium shadow"
            >
              Login Admin
            </Link>
          </motion.div>
        )}
      </nav>
    </header>
  );
}
