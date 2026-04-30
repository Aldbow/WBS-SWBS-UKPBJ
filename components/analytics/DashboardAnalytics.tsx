'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface AnalyticsData {
  laporanData: any[];
  deklarasiData: any[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

const DashboardAnalytics = ({ laporanData, deklarasiData }: AnalyticsData) => {
  // Process data for charts
  const laporanByCategory = laporanData.reduce((acc, item) => {
    const category = item.kategori || 'Tidak Dikategorikan';
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Convert to chart-ready format
  const categoryData = Object.entries(laporanByCategory).map(([name, value]) => ({ name, value }));

  // Calculate time to resolution (simplified)
  const today = new Date();
  const weeklyReportData = [
    { day: 'Senin', laporan: 0, deklarasi: 0 },
    { day: 'Selasa', laporan: 0, deklarasi: 0 },
    { day: 'Rabu', laporan: 0, deklarasi: 0 },
    { day: 'Kamis', laporan: 0, deklarasi: 0 },
    { day: 'Jumat', laporan: 0, deklarasi: 0 },
    { day: 'Sabtu', laporan: 0, deklarasi: 0 },
    { day: 'Minggu', laporan: 0, deklarasi: 0 },
  ];

  // Populate weekly report data
  const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  laporanData.forEach(item => {
    if (item.waktuPelaporan) {
      const date = new Date(item.waktuPelaporan);
      const dayIndex = date.getDay();
      const dayName = dayNames[dayIndex];
      const dayIndexInData = weeklyReportData.findIndex(d => d.day === dayName);
      if (dayIndexInData !== -1) {
        weeklyReportData[dayIndexInData].laporan += 1;
      }
    }
  });

  deklarasiData.forEach(item => {
    if (item.waktuKirim) {
      const date = new Date(item.waktuKirim);
      const dayIndex = date.getDay();
      const dayName = dayNames[dayIndex];
      const dayIndexInData = weeklyReportData.findIndex(d => d.day === dayName);
      if (dayIndexInData !== -1) {
        weeklyReportData[dayIndexInData].deklarasi += 1;
      }
    }
  });

  return (
    <div className="grid grid-cols-1 gap-6 mb-8">
      {/* Weekly Activity */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Aktivitas Mingguan</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyReportData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="laporan" fill="#8884d8" name="Laporan" />
              <Bar dataKey="deklarasi" fill="#82CA9D" name="Deklarasi" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DashboardAnalytics;