'use client';

import { useState, useRef, useEffect } from 'react';

interface DatePickerProps {
  value: string;
  onChange: (date: string) => void;
  required?: boolean;
  label: string;
  placeholder?: string;
}

const DatePicker: React.FC<DatePickerProps> = ({ 
  value, 
  onChange, 
  required = false, 
  label,
  placeholder = 'Pilih tanggal dan waktu...'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(value ? new Date(value) : null);
  const [currentViewDate, setCurrentViewDate] = useState<Date>(() => {
    // Use the value date if available, otherwise use today's date as default view
    if (value) return new Date(value);
    return new Date();
  });
  const datePickerRef = useRef<HTMLDivElement>(null);

  // Extract time from value if it exists
  const [time, setTime] = useState<string>(() => {
    if (value) {
      const date = new Date(value);
      return date.toTimeString().substring(0, 5); // HH:MM format
    }
    return '00:00';
  });

  const formatDate = (date: Date, time: string) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}T${time}`;
  };

  const formatDisplayDate = (date: Date) => {
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    // Use the current time if no time has been selected yet
    const timeToUse = time || '00:00';
    onChange(formatDate(date, timeToUse));
  };

  const handleTimeChange = (time: string) => {
    setTime(time);
    if (selectedDate) {
      onChange(formatDate(selectedDate, time));
    }
  };

  const handleTodayClick = () => {
    const now = new Date();
    setSelectedDate(now);
    const timeString = now.toTimeString().substring(0, 5);
    setTime(timeString);
    onChange(formatDate(now, timeString));
  };

  const handleClearClick = () => {
    setSelectedDate(null);
    setTime('00:00');
    onChange('');
    setIsOpen(false);
  };

  // Close the date picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Generate calendar days
  const generateCalendar = () => {
    // Use currentViewDate to determine which month to show, regardless of selectedDate
    const date = new Date(currentViewDate);
    const year = date.getFullYear();
    const month = date.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDay = firstDay.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const daysInMonth = lastDay.getDate();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startDay; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return {
      days,
      currentMonth: month,
      currentYear: year
    };
  };

  const { days, currentMonth, currentYear } = generateCalendar();
  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  const goToPreviousMonth = () => {
    const newDate = new Date(currentViewDate);
    newDate.setMonth(newDate.getMonth() - 1);
    setCurrentViewDate(newDate);
  };

  const goToNextMonth = () => {
    const newDate = new Date(currentViewDate);
    newDate.setMonth(newDate.getMonth() + 1);
    setCurrentViewDate(newDate);
  };

  const today = new Date();
  // Calculate today's date at the start of the day for comparison
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  
  const isFutureDate = (date: Date | null) => {
    if (!date) return false;
    // Create a date object for today at the start of the day for comparison
    const todayCheck = new Date();
    todayCheck.setHours(0, 0, 0, 0);
    
    return date > todayCheck;
  };

  return (
    <div className="relative" ref={datePickerRef}>
      <label className="form-label">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="input-field w-full text-left flex items-center justify-between"
        >
          <span>
            {selectedDate ? `${formatDisplayDate(selectedDate)} ${time ? `| ${time}` : ''}` : placeholder}
          </span>
          <span className="text-gray-400">📅</span>
        </button>
      </div>

      {isOpen && (
        <div className="absolute z-10 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-4 w-72">
          <div className="flex items-center justify-between mb-4">
            <button 
              onClick={goToPreviousMonth}
              className="p-1 rounded hover:bg-gray-100"
            >
              &lt;
            </button>
            <span className="font-semibold">
              {monthNames[currentMonth]} {currentYear}
            </span>
            {/* Disable next month button if it's in the future */}
            <button 
              onClick={goToNextMonth}
              className={`p-1 rounded ${(currentYear > today.getFullYear()) || 
                    (currentYear === today.getFullYear() && currentMonth >= today.getMonth()) 
                    ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'}`}
              disabled={(currentYear > today.getFullYear()) || 
                    (currentYear === today.getFullYear() && currentMonth >= today.getMonth())}
            >
              &gt;
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map((day, index) => (
              <div 
                key={index} 
                className="text-center text-xs font-medium text-gray-500 py-1"
              >
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {days.map((day, index) => (
              <button
                key={index}
                onClick={() => day && !isFutureDate(day) && handleDateSelect(day)}
                disabled={!day || isFutureDate(day)}
                className={`
                  text-center text-sm p-1 rounded
                  ${!day 
                    ? 'invisible'
                    : isFutureDate(day)
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : day.getDate() === today.getDate() && 
                      day.getMonth() === today.getMonth() && 
                      day.getFullYear() === today.getFullYear()
                      ? 'bg-blue-500 text-white'
                      : selectedDate && 
                        day.getDate() === selectedDate.getDate() && 
                        day.getMonth() === selectedDate.getMonth() && 
                        day.getFullYear() === selectedDate.getFullYear()
                        ? 'bg-primary-500 text-white'
                        : 'hover:bg-gray-100'
                  }
                `}
              >
                {day?.getDate()}
              </button>
            ))}
          </div>

          {/* Time Picker - Limit to current time if selected date is today */}
          <div className="mt-3 pt-3 border-t">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Waktu:</span>
              <input
                type="time"
                value={time}
                onChange={(e) => handleTimeChange(e.target.value)}
                className="p-1 border border-gray-300 rounded text-sm"
                max={selectedDate && 
                     selectedDate.getDate() === today.getDate() && 
                     selectedDate.getMonth() === today.getMonth() && 
                     selectedDate.getFullYear() === today.getFullYear() 
                     ? `${String(today.getHours()).padStart(2, '0')}:${String(today.getMinutes()).padStart(2, '0')}`
                     : undefined}
              />
            </div>
          </div>

          <div className="flex justify-between mt-3">
            <button
              type="button"
              onClick={handleTodayClick}
              className="text-sm text-primary-600 hover:text-primary-800 font-medium"
            >
              Sekarang
            </button>
            <button
              type="button"
              onClick={handleClearClick}
              className="text-sm text-gray-600 hover:text-gray-800 font-medium"
            >
              Hapus
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DatePicker;